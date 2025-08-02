const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Image', imageSchema);