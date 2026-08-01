import { Request, Response } from 'express';
import { communityService } from '../services/communityService';

export class CommunityController {
  async getAllCommunities(req: Request, res: Response): Promise<void> {
    try {
      const communities = await communityService.getAllCommunities();
      res.status(200).json(communities);
    } catch (error: any) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getCommunityById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const community = await communityService.getCommunityById(id);
      res.status(200).json(community);
    } catch (error: any) {
      if (error.message?.includes('not exist')) {
        res.status(400).json({ message: 'Community not exist.' });
      } else {
        res.status(500).json({
          message: 'Internal server error',
          error: error.message,
        });
      }
    }
  }

  async joinCommunity(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { member } = req.body;
      const community = await communityService.joinCommunity(id, member);
      res.status(200).json(community);
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        res.status(400).json({ message: 'Community does not exist.' });
      } else if (error.message?.includes('already joined')) {
        res.status(403).json({ message: 'User already joined' });
      } else {
        res.status(500).json({ message: 'An error occurred: ' + error.message });
      }
    }
  }

  async leaveCommunity(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { member } = req.body;
      const community = await communityService.leaveCommunity(id, member);
      res.status(200).json(community);
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        res.status(400).json({ message: 'Community does not exist.' });
      } else {
        res.status(500).json({ message: 'An error occurred: ' + error.message });
      }
    }
  }

  async createCommunity(req: Request, res: Response): Promise<void> {
    try {
      const community = await communityService.createCommunity(req.body);
      res.status(200).json(community);
    } catch (error: any) {
      if (error.message?.includes('empty')) {
        res.status(400).json({ message: 'Fields cannot be empty' });
      } else {
        res.status(500).json({ message: 'An error occurred. ' + error.message });
      }
    }
  }

  async deleteCommunity(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const community = await communityService.deleteCommunity(id);
      res.status(200).json(community);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        res.status(404).json({ message: 'Community not found.' });
      } else {
        res.status(500).json({
          message: 'Internal server error',
          error: error.message,
        });
      }
    }
  }
}

export const communityController = new CommunityController();

export const getAllCommunities = (req: Request, res: Response) => communityController.getAllCommunities(req, res);
export const getCommunityById = (req: Request, res: Response) => communityController.getCommunityById(req, res);
export const joinCommunity = (req: Request, res: Response) => communityController.joinCommunity(req, res);
export const leaveCommunity = (req: Request, res: Response) => communityController.leaveCommunity(req, res);
export const createCommunity = (req: Request, res: Response) => communityController.createCommunity(req, res);
export const deleteCommunity = (req: Request, res: Response) => communityController.deleteCommunity(req, res);

export default communityController;
