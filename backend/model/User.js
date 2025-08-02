const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: { type: String, require: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: mongoose.Schema.Types.Mixed, default: null },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('User', userSchema);