import { Request, Response } from 'express';
import { artifactService } from '../services/artifactService';

export class ArtifactController {
  async getArtifactById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const artifact = await artifactService.getArtifactById(id);
      res.status(200).json(artifact);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        res.status(404).json({ message: 'Artifact not found' });
      } else {
        res.status(500).json({ message: 'Error fetching artifact: ' + error.message });
      }
    }
  }

  async deleteArtifact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await artifactService.deleteArtifact(id);
      res.status(200).json({ message: 'Artifact deleted successfully' });
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        res.status(404).json({ message: 'Artifact not found' });
      } else {
        res.status(500).json({ message: 'Error deleting artifact: ' + error.message });
      }
    }
  }

  async searchArtifacts(req: Request, res: Response): Promise<void> {
    try {
      const query = req.params.query as string;
      const results = await artifactService.searchArtifacts(query);
      res.status(200).json(results);
    } catch (error: any) {
      res.status(500).json({ message: 'Error searching artifacts: ' + error.message });
    }
  }

  async likeArtifact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { userId } = req.body;
      const artifact = await artifactService.likeArtifact(id, userId);
      res.status(200).json(artifact);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        res.status(404).json({ message: 'Artifact not found' });
      } else {
        res.status(500).json({ message: 'Error updating like: ' + error.message });
      }
    }
  }

  async unlikeArtifact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { userId } = req.body;
      const artifact = await artifactService.unlikeArtifact(id, userId);
      res.status(200).json(artifact);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        res.status(404).json({ message: 'Artifact not found' });
      } else {
        res.status(500).json({ message: 'Error removing like: ' + error.message });
      }
    }
  }

  async getAllArtifacts(req: Request, res: Response): Promise<void> {
    try {
      const artifacts = await artifactService.getAllArtifacts();
      res.status(200).json(artifacts);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching artifacts: ' + error.message });
    }
  }

  async uploadArtifact(req: Request, res: Response): Promise<void> {
    try {
      const artifact = await artifactService.uploadArtifact(req.body);
      res.status(201).json(artifact);
    } catch (error: any) {
      if (error.message?.includes('Invalid')) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error creating artifact: ' + error.message });
      }
    }
  }
}

export const artifactController = new ArtifactController();

export const getArtifactById = (req: Request, res: Response) => artifactController.getArtifactById(req, res);
export const deleteArtifact = (req: Request, res: Response) => artifactController.deleteArtifact(req, res);
export const searchArtifacts = (req: Request, res: Response) => artifactController.searchArtifacts(req, res);
export const likeArtifact = (req: Request, res: Response) => artifactController.likeArtifact(req, res);
export const unlikeArtifact = (req: Request, res: Response) => artifactController.unlikeArtifact(req, res);
export const getAllArtifacts = (req: Request, res: Response) => artifactController.getAllArtifacts(req, res);
export const uploadArtifact = (req: Request, res: Response) => artifactController.uploadArtifact(req, res);

export default artifactController;
