import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { INewsletter } from '../types';

export interface INewsletterDocument extends Omit<INewsletter, '_id' | 'id'>, Document {
  id?: any;
}

const newsletterSchema = new Schema<INewsletterDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    title: { type: String, required: true },
    desc: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Newsletter = mongoose.models.Newsletter || mongoose.model<INewsletterDocument>('Newsletter', newsletterSchema);

export default Newsletter;
export { Newsletter };
