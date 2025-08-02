const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const newsletterSchema = mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    title: { type: String, required: true },
    desc: { type: String, default: '' }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);