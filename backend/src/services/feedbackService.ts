import { feedbackRepository } from '../repository/feedbackRepository';
import { IFeedback } from '../types';

export class FeedbackService {
  async getAllFeedback() {
    return await feedbackRepository.findAll();
  }

  async getFeedbackById(id: string) {
    if (!id) {
      throw new Error('Feedback not found.');
    }
    const feedback = await feedbackRepository.findById(id);
    if (!feedback) {
      throw new Error('Feedback not found.');
    }
    return feedback;
  }

  async createFeedback(data: { name?: string; email?: string; subject?: string; description?: string }) {
    const { name, email, subject, description } = data;
    if (!name || !email || !subject) {
      throw new Error('Fields cannot be empty');
    }

    return await feedbackRepository.createFeedback({
      name,
      email,
      subject,
      description: description || '',
    });
  }

  async deleteFeedback(id: string) {
    const feedback = await feedbackRepository.deleteFeedback(id);
    if (!feedback) {
      throw new Error('Feedback not found.');
    }
    return feedback;
  }
}

export const feedbackService = new FeedbackService();

export const getAllFeedback = () => feedbackService.getAllFeedback();
export const getFeedbackById = (id: string) => feedbackService.getFeedbackById(id);
export const createFeedback = (data: { name?: string; email?: string; subject?: string; description?: string }) =>
  feedbackService.createFeedback(data);
export const deleteFeedback = (id: string) => feedbackService.deleteFeedback(id);

export default feedbackService;
