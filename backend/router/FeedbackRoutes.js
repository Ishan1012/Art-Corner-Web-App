const express = require('express')
const router = express.Router()
const Feedback = require('../model/Feedback');
const { generateTokenResponse } = require('../utils/generateTokenResponse');

router.get('/', async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

router.post('/', async (req, res) => {
    const { name, email, subject, description } = req.body;

    if(!name || !email || !subject || !description) {
        return res.status(400).send({ message: 'Fields cannot be empty' });
    }

    try {
        const newFeedback = {
            name,
            email,
            subject,
            description
        }

        const dbFeedback = await Feedback.create(newFeedback);

        if(dbFeedback) {
            res.status(200).json(generateTokenResponse(dbFeedback));
        }
    } catch (err) {
        res.status(500).send({ message: 'An error occurred.' + err + " token: " + token })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findOneAndDelete({ id });

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found.' });
        }
        
        res.send(200).json(generateTokenResponse(feedback));
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred.',
            error: err.message
        });
    }
})

module.exports = router;