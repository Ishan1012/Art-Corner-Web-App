import { Request, Response } from 'express';
import { postService } from '../services/postService';

export class PostController {
  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const post = await postService.getPostById(id);
      res.status(200).json(post);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Post not found' });
    }
  }

  async getPostsByCommunity(req: Request, res: Response): Promise<void> {
    try {
      const communityId = req.params.communityId as string;
      const posts = await postService.getPostsByCommunity(communityId);
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { communityId, authorId, authorName, title, content, img, flair } = req.body;
      const post = await postService.createPost({
        communityId,
        authorId: authorId || req.user?.id || req.user?._id,
        authorName: authorName || req.user?.username || 'Artist',
        title,
        content,
        img,
        flair,
      });
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create post' });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const post = await postService.deletePost(id);
      res.status(200).json({ message: 'Post deleted', post });
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Post not found' });
    }
  }

  async votePost(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { userId, type } = req.body;
      const actualUser = userId || req.user?.id || req.user?._id;
      const post = await postService.votePost(id, actualUser, type || 'up');
      res.status(200).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to vote' });
    }
  }
}

export const postController = new PostController();
export default postController;
