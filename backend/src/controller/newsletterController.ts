import { Request, Response } from 'express';
import { newsletterService } from '../services/newsletterService';

export class NewsletterController {
  async getAllNewsletters(req: Request, res: Response): Promise<void> {
    try {
      const newsletters = await newsletterService.getAllNewsletters();
      res.status(200).json(newsletters);
    } catch (error: any) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async subscribeNewsletter(req: Request, res: Response): Promise<void> {
    try {
      const newsletter = await newsletterService.subscribeNewsletter(req.body);
      res.status(200).json(newsletter);
    } catch (error: any) {
      if (error.message?.includes('empty')) {
        res.status(400).json({ message: 'Fields cannot be empty' });
      } else {
        res.status(500).json({
          message: 'Internal server error',
          error: error.message,
        });
      }
    }
  }

  async deleteNewsletter(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const newsletter = await newsletterService.deleteNewsletter(id);
      res.status(200).json(newsletter);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        res.status(404).json({ message: 'Newsletter not found.' });
      } else {
        res.status(500).json({
          message: 'Internal server error',
          error: error.message,
        });
      }
    }
  }
}

export const newsletterController = new NewsletterController();

export const getAllNewsletters = (req: Request, res: Response) => newsletterController.getAllNewsletters(req, res);
export const subscribeNewsletter = (req: Request, res: Response) => newsletterController.subscribeNewsletter(req, res);
export const deleteNewsletter = (req: Request, res: Response) => newsletterController.deleteNewsletter(req, res);

export default newsletterController;
