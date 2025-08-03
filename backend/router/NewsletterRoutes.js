const express = require('express')
const router = express.Router()
const Newsletter = require('../model/Newsletter');

router.get('/', async (req, res) => {
    try {
        const newsletter = await Newsletter.find();
        res.status(200).json(newsletter);
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

router.post('/', async (req, res) => {
    const { title, desc } = req.body;

    if(!title || !desc) {
        return res.status(400).send({ message: 'Fields cannot be empty' });
    }

    try {
        const newNewsletter = {
            title, 
            desc
        }

        const dbNewsletter = await Newsletter.create(newNewsletter);

        res.status(200).json(dbNewsletter);
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const newsletter = await Newsletter.findOneAndDelete({ id });

        if(!newsletter) {
            return res.status(404).json({ message: 'Newsletter not found.' });
        }

        res.status(200).json(generateTokenResponse(newsletter));
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

module.exports = router;