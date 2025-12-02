const express = require('express')
const router = express.Router()
const Image = require('../model/Image')
const User = require('../model/User')
const dotenv = require('dotenv');
const { generateTokenResponse } = require("../utils/generateTokenResponse");

dotenv.config();

router.post('/generate', async (req, res) => {
    const { userid, prompt } = req.body;

    if (!userid || !prompt) {
        return res.status(400).json({
            message: 'Invalid input. All fields are required and cannot be empty.'
        })
    }

    try {
        const user = await User.findOne({ id: userid });

        if (!user) {
            return res.status(403).json({
                message: 'unauthorized access. Please sign in to access this feature'
            })
        }

        if (!process.env.HF_TOKEN) {
            return res.status(500).json({ message: 'HF_TOKEN not configured on server.' });
        }

        const HF_URL = process.env.HF_IMAGE_ENDPOINT || "https://router.huggingface.co/wavespeed/api/v3/wavespeed-ai/z-image/turbo";

        const payload = {
            inputs: prompt
        };

        const hfResponse = await fetch(HF_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify(payload),
        });

        if (!hfResponse.ok) {
            let errText = hfResponse.statusText;
            try {
                const errJson = await hfResponse.json();
                errText = errJson.error || JSON.stringify(errJson);
            } catch (_) {}
            throw new Error(`HuggingFace API error: ${hfResponse.status} ${errText}`);
        }

        const contentType = hfResponse.headers.get('content-type') || '';

        let imageBuffer;
        let detectedContentType = contentType;

        if (contentType.includes('application/json')) {
            const json = await hfResponse.json();
            const base64 =
                json.image_base64 ||
                json.image ||
                (Array.isArray(json) && json[0]?.image_base64) ||
                (json[0] && json[0].base64) ||
                json.data?.[0]?.b64_json ||
                json.generated_images?.[0];

            if (!base64) {
                throw new Error('Unexpected JSON response from Hugging Face: no image data found.');
            }

            const base64Str = typeof base64 === 'string' ? base64 : (base64.b64 || base64.base64 || base64.b64_json || base64.data);
            if (!base64Str || typeof base64Str !== 'string') {
                throw new Error('Unable to extract base64 image string from HF JSON response.');
            }

            imageBuffer = Buffer.from(base64Str, 'base64');
            detectedContentType = json.content_type || 'image/png';
        } else {
            const arrayBuffer = await hfResponse.arrayBuffer();
            imageBuffer = Buffer.from(arrayBuffer);
            if (!detectedContentType) detectedContentType = 'image/png';
        }

        const newImage = new Image({
            img: imageBuffer,
            ...(detectedContentType && { contentType: detectedContentType }),
            userid,
            prompt,
            responseText: undefined
        });

        const dbImage = await newImage.save();

        return res.status(200).json(generateTokenResponse(dbImage));

    } catch (err) {
        return res.status(500).json({ message: 'Error generating image: ' + err.message });
    }
})

module.exports = router;