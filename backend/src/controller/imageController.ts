import { Request, Response } from 'express';
import { imageService } from '../services/imageService';

export class ImageController {
  async generateImage(req: Request, res: Response): Promise<void> {
    try {
      const { userid, prompt } = req.body;
      const result = await imageService.generateImage({ userid, prompt });
      res.status(200).json(result);
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.includes('Invalid input')) {
        res.status(400).json({ message: 'Invalid input. All fields are required and cannot be empty.' });
      } else if (msg.includes('unauthorized')) {
        res.status(403).json({ message: 'unauthorized access. Please sign in to access this feature' });
      } else if (msg.includes('HF_TOKEN')) {
        res.status(500).json({ message: 'HF_TOKEN not configured on server.' });
      } else {
        res.status(500).json({ message: 'Error generating image: ' + msg });
      }
    }
  }

  async getAllImages(req: Request, res: Response): Promise<void> {
    try {
      const images = await imageService.getAllImages();
      res.status(200).json(images);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching images: ' + error.message });
    }
  }

  async getImageById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const image = await imageService.getImageById(id);
      res.status(200).json(image);
    } catch (error: any) {
      res.status(404).json({ message: 'Image not found' });
    }
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const image = await imageService.deleteImage(id);
      res.status(200).json({ message: 'Image deleted successfully', image });
    } catch (error: any) {
      res.status(404).json({ message: 'Image not found' });
    }
  }
}

export const imageController = new ImageController();

export const generateImage = (req: Request, res: Response) => imageController.generateImage(req, res);
export const getAllImages = (req: Request, res: Response) => imageController.getAllImages(req, res);
export const getImageById = (req: Request, res: Response) => imageController.getImageById(req, res);
export const deleteImage = (req: Request, res: Response) => imageController.deleteImage(req, res);

export default imageController;
