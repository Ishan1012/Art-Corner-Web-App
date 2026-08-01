import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Feedback, { IFeedbackDocument } from '../models/Feedback';
import { IFeedback } from '../types';

export class FeedbackRepository {
  async findById(id: string): Promise<IFeedbackDocument | null> {
    if (!id) return null;
    let feedback = await Feedback.findOne({ id });
    if (!feedback && mongoose.isValidObjectId(id)) {
      feedback = await Feedback.findById(id);
    }
    return feedback;
  }

  async findAll(): Promise<IFeedbackDocument[]> {
    return await Feedback.find();
  }

  async createFeedback(feedbackData: Partial<IFeedback>): Promise<IFeedbackDocument> {
    const data = { ...feedbackData };
    if (!data.id) {
      data.id = uuidv4();
    }
    return await Feedback.create(data);
  }

  async deleteFeedback(id: string): Promise<IFeedbackDocument | null> {
    if (!id) return null;
    let feedback = await Feedback.findOneAndDelete({ id });
    if (!feedback && mongoose.isValidObjectId(id)) {
      feedback = await Feedback.findByIdAndDelete(id);
    }
    return feedback;
  }
}

export const feedbackRepository = new FeedbackRepository();

export const findById = (id: string) => feedbackRepository.findById(id);
export const findAll = () => feedbackRepository.findAll();
export const createFeedback = (feedbackData: Partial<IFeedback>) => feedbackRepository.createFeedback(feedbackData);
export const deleteFeedback = (id: string) => feedbackRepository.deleteFeedback(id);

export default feedbackRepository;
