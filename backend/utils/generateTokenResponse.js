const jwt = require('jsonwebtoken');

const generateTokenResponse = (user) => {
    const token = jwt.sign({
        email: user.email, isAdmin: user.isAdmin
    }, "SomeRandomText", {
        expiresIn: "30d"
    });

    user.token = token;
    return user;
}

module.exports = { generateTokenResponse };