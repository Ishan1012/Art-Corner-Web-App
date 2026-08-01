import { Request, Response } from 'express';
import { feedbackService } from '../services/feedbackService';

export class FeedbackController {
  async getAllFeedback(req: Request, res: Response): Promise<void> {
    try {
      const feedback = await feedbackService.getAllFeedback();
      res.status(200).json(feedback);
    } catch (error: any) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async createFeedback(req: Request, res: Response): Promise<void> {
    try {
      const feedback = await feedbackService.createFeedback(req.body);
      res.status(200).json(feedback);
    } catch (error: any) {
      if (error.message?.includes('empty')) {
        res.status(400).json({ message: 'Fields cannot be empty' });
      } else {
        res.status(500).json({ message: 'An error occurred. ' + error.message });
      }
    }
  }

  async deleteFeedback(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const feedback = await feedbackService.deleteFeedback(id);
      res.status(200).json(feedback);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        res.status(404).json({ message: 'Feedback not found.' });
      } else {
        res.status(500).json({
          message: 'An error occurred.',
          error: error.message,
        });
      }
    }
  }
}

export const feedbackController = new FeedbackController();

export const getAllFeedback = (req: Request, res: Response) => feedbackController.getAllFeedback(req, res);
export const createFeedback = (req: Request, res: Response) => feedbackController.createFeedback(req, res);
export const deleteFeedback = (req: Request, res: Response) => feedbackController.deleteFeedback(req, res);

export default feedbackController;
