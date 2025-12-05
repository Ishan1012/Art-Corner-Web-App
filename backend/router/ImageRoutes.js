const express = require('express')
const router = express.Router()
const Image = require('../model/Image')
const User = require('../model/User')
const dotenv = require('dotenv');
const { generateTokenResponse } = require("../utils/generateTokenResponse");
const { InferenceClient } = require("@huggingface/inference");

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

        // Use HuggingFace InferenceClient
        const client = new InferenceClient(
            provider = "nebius",
            api_key = os.environ["HF_TOKEN"],
        );

        // Call the textToImage method
        const imageBlob = await client.textToImage({
            provider: "hf-inference",
            model: "black-forest-labs/FLUX.1-schnell",
            inputs: prompt,
            parameters: { num_inference_steps: 5 },
        });

        // Convert Blob to Buffer
        const arrayBuffer = await imageBlob.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        // Save image to DB
        const newImage = new Image({
            img: imageBuffer,
            contentType: imageBlob.type || 'image/png',
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