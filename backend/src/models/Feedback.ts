import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IFeedback } from '../types';

export interface IFeedbackDocument extends Omit<IFeedback, '_id' | 'id'>, Document {
  id?: any;
}

const feedbackSchema = new Schema<IFeedbackDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Feedback = mongoose.models.Feedback || mongoose.model<IFeedbackDocument>('Feedback', feedbackSchema);

export default Feedback;
export { Feedback };
