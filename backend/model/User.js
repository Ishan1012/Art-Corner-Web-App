const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const userSchema = mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'active' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    isAdmin: { type: Boolean, default: false },
    img: {
        type: mongoose.Schema.Types.Mixed, 
        default: '/profiles/profile1.png',
        validate: {
            validator: function (value) {
                return typeof value === 'string' || Buffer.isBuffer(value);
            },
            message: 'img must be a string or a Buffer',
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('User', userSchema);