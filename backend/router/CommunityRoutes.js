const express = require('express');
const router = express.Router();
const Community = require('../model/Community');
const { generateTokenResponse } = require('../utils/generateTokenResponse');

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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { member } = req.body;
    
    try {
        const community = await Community.findOne({ id })

        if (!community) {
            return res.status(400).send({ message: 'Community not exist.' });
        }

        community.members.push(member);
        const dbCommmunity = await community.save();

        if(dbCommmunity) {
            res.status(200).json(generateTokenResponse(dbCommmunity));
        }
    }
    catch (err) {
        res.status(500).send({ message: 'An error occurred.' + err + " token: " + token })
    }
})

router.post('/create', async (req, res) => {
    const { name, members, description, img } = req.body;

    if (!name || !description) {
        return res.status(400).send({
            message: 'Fields cannot be empty'
        });
    }

    try {
        const newCommunity = {
            name,
            members,
            description,
            img
        };

        const dbCommmunity = await Community.create(newCommunity);

        if (dbCommmunity) {
            res.status(200).json(generateTokenResponse(dbCommmunity));
        }
    } catch (err) {
        res.status(500).send({ message: 'An error occurred. ' + err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const community = await Community.findOneAndDelete({ id });

        if(!community) {
            return res.status(404).json({ message: 'Newsletter not found.' });
        }

        res.status(200).json(generateTokenResponse(community));
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

module.exports = router;