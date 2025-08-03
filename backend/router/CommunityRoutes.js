const express = require('express');
const router = express.Router();
const Community = require('../model/Community');

router.get('/', async (req, res) => {
    try {
        const community = await Community.find();
        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const community = await Community.findOne({ id });

        if(!community) {
            return res.status(400).json({ message: 'Community not exist.' });
        }

        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

router.patch('/:id/join', async (req, res) => {
    const { id } = req.params;
    const { member } = req.body;

    try {
        const community = await Community.findOne({ id });

        if (!community) {
            return res.status(400).json({ message: 'Community does not exist.' });
        }

        const isAlreadyMember = community.members.some(m =>
            m.toString() === member || m.equals?.(member)
        );

        if (!isAlreadyMember) {
            community.members.push(member);
            const dbCommunity = await community.save();
            return res.status(200).json(dbCommunity);
        } else {
            return res.status(403).json({ message: 'User already joined' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred: ' + err.message });
    }
});

router.patch('/:id/leave', async (req, res) => {
    const { id } = req.params;
    const { member } = req.body;

    try {
        const community = await Community.findOne({ id });

        if (!community) {
            return res.status(400).json({ message: 'Community does not exist.' });
        }

        community.members = community.members.filter(m =>
            m.toString() !== member && !m.equals?.(member)
        );

        const dbCommunity = await community.save();
        return res.status(200).json(dbCommunity);
    } catch (err) {
        res.status(500).json({ message: 'An error occurred: ' + err.message });
    }
});

router.post('/create', async (req, res) => {
    const { name, members, description, img } = req.body;

    if (!name || !description) {
        return res.status(400).json({
            message: 'Fields cannot be empty'
        });
    }

    try {
        const newCommunity = {
            name,
            ...(members && { members }),
            description,
            ...(img && { img }) 
        };

        const dbCommmunity = await Community.create(newCommunity);

        if (dbCommmunity) {
            res.status(200).json(dbCommmunity);
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred. ' + err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const community = await Community.findOneAndDelete({ id });

        if(!community) {
            return res.status(404).json({ message: 'Newsletter not found.' });
        }

        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

module.exports = router;