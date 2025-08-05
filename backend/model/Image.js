const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const imageSchema = mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    img: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
            validator: function (value) {
                return typeof value === 'string' || Buffer.isBuffer(value);
            },
            message: 'img must be a string or a Buffer',
        },
    },
    contentType: { type: String, default: 'image/png' },
    userid: { type: String, required: true },
    prompt: { type: String, required: true },
    responseText: {type: String, default: ''},
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Image', imageSchema)