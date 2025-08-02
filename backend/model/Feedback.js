const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const feedbackSchema = mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, default: '' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Feedback', feedbackSchema);