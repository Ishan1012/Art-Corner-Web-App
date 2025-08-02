const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const commmunitySchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    description: { type: String, default: '' },
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
})

module.exports = mongoose.model('Community', commmunitySchema);