import { commentRepository } from '../repository/commentRepository';
import { postRepository } from '../repository/postRepository';

export class CommentService {
  async getCommentsByPost(postId: string) {
    return await commentRepository.findByPost(postId);
  }

  async createComment(data: {
    postId: string;
    authorId: string;
    authorName?: string;
    content: string;
  }) {
    const { postId, authorId, content } = data;
    if (!postId || !authorId || !content) {
      throw new Error('Post ID, author ID, and content are required');
    }

    const comment = await commentRepository.createComment(data);
    await postRepository.incrementCommentCount(postId, 1);
    return comment;
  }

  async deleteComment(id: string) {
    const comment = await commentRepository.deleteComment(id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    await postRepository.incrementCommentCount(comment.postId, -1);
    return comment;
  }

  async voteComment(id: string, userId: string) {
    if (!id || !userId) {
      throw new Error('Comment ID and user ID are required');
    }
    const comment = await commentRepository.voteComment(id, userId);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return comment;
  }
}

export const commentService = new CommentService();
export default commentService;
