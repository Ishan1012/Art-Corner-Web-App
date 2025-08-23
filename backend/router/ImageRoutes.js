const { GoogleGenAI, Modality } = require("@google/genai");
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

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: prompt,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        let responseText = undefined;

        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                responseText = part.text;
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const contentType = part.inlineData.mimeType;
                const buffer = Buffer.from(imageData, "base64");

                const newImage = new Image({
                    img: buffer,
                    ...(contentType && { contentType }),
                    userid,
                    prompt,
                    responseText
                })

                const dbImage = await newImage.save();
                res.status(200).json(generateTokenResponse(dbImage));
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error generating image: ' + err.message });
    }
})

module.exports = router;