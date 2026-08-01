import { Request, Response } from 'express';
import { commentService } from '../services/commentService';

export class CommentController {
  async getCommentsByPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId as string;
      const comments = await commentService.getCommentsByPost(postId);
      res.status(200).json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { postId, authorId, authorName, content } = req.body;
      const comment = await commentService.createComment({
        postId,
        authorId: authorId || req.user?.id || req.user?._id,
        authorName: authorName || req.user?.username || 'Artist',
        content,
      });
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create comment' });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const comment = await commentService.deleteComment(id);
      res.status(200).json({ message: 'Comment deleted', comment });
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Comment not found' });
    }
  }

  async voteComment(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { userId } = req.body;
      const actualUser = userId || req.user?.id || req.user?._id;
      const comment = await commentService.voteComment(id, actualUser);
      res.status(200).json(comment);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to vote comment' });
    }
  }
}

export const commentController = new CommentController();
export default commentController;
