const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: mongoose.Schema.Types.Mixed, required: true},
    contentType: { type: String, required: true },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String, default: [] }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Artifact', artifactSchema);