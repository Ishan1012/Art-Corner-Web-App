import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IImage } from '../types';

export interface IImageDocument extends Omit<IImage, '_id' | 'id'>, Document {
  id?: any;
}

const imageSchema = new Schema<IImageDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    img: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (value: any) {
          return (
            typeof value === 'string' ||
            Buffer.isBuffer(value) ||
            (value && typeof value === 'object' && ('_bsontype' in value || 'buffer' in value || value.constructor?.name === 'Binary'))
          );
        },
        message: 'img must be a string or a Buffer',
      },
    },
    contentType: { type: String, default: 'image/png' },
    userid: { type: String, required: true },
    prompt: { type: String, required: true },
    responseText: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Image = mongoose.models.Image || mongoose.model<IImageDocument>('Image', imageSchema);

export default Image;
export { Image };
