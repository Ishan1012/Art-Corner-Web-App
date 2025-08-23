const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateTokenResponse = (user) => {
    const token = jwt.sign({
        email: user.email, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    user.token = token;
    return user;
}

module.exports = { generateTokenResponse };