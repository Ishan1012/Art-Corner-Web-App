const express = require('express');
const router = express.Router();
const User = require('../model/User');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Message, VerificationPage } = require('../utils/Message');
const { generateTokenResponse } = require('../utils/generateTokenResponse');

dotenv.config();

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { id },
            updates,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOneAndDelete({ id });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            user
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        })
    }
})

router.get('/getlist/:pass', async (req, res) => {
    const { pass } = req.params;

    if (pass !== process.env.PASSWORD) {
        return res.status(403).json({
            message: 'Forbidden: Invalid password' + pass
        });
    }

    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400).json({ message: "Username or password is not valid"});
        return;
    }

    if (user.status !== "active") {
        res.status(404).json({ message: "User has been blocked by the admin"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        res.json({user: generateTokenResponse(user)});
    }
    else {
        res.status(400).json("Username or password is not valid");
    }
});

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        res.status(400).json({message: 'User already exists, please login!'});
        return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    try {
        const newUser = {
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            verificationToken,
        }

        const dbUser = await User.create(newUser);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS
            }
        })

        const verificationUrl = `${process.env.BASE_URL}/api/users/verify?token=${verificationToken}`;
        await transporter.sendMail({
            from: `Art Corner <${process.env.EMAIL_ID}>`,
            to: email,
            subject: 'Verify Your Email',
            html: Message(verificationUrl, process.env.HERO_IMG),
        })

        res.status(200).json({ user:generateTokenResponse(dbUser) });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while creating the user.'+err });
        console.log(err);
    }
})

router.get('/verify', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ verificationToken: token })

        if (!user) {
            return res.status(400).send({ message: 'Invalid or expired token.' })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).send(VerificationPage());
    }
    catch (err) {
        res.status(500).json({ message: 'An error occurred during email verification. ' + err + " token: " + token })
    }
})

module.exports = router;