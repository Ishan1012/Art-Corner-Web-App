import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Comment, { ICommentDocument } from '../models/Comment';
import { IComment } from '../types';

export class CommentRepository {
  async findById(id: string): Promise<ICommentDocument | null> {
    if (!id) return null;
    let comment = await Comment.findOne({ id });
    if (!comment && mongoose.isValidObjectId(id)) {
      comment = await Comment.findById(id);
    }
    return comment;
  }

  async findByPost(postId: string): Promise<ICommentDocument[]> {
    return await Comment.find({ postId }).sort({ createdAt: 1 });
  }

  async createComment(data: Partial<IComment>): Promise<ICommentDocument> {
    const commentData = { ...data };
    if (!commentData.id) {
      commentData.id = uuidv4();
    }
    return await Comment.create(commentData);
  }

  async deleteComment(id: string): Promise<ICommentDocument | null> {
    if (!id) return null;
    let comment = await Comment.findOneAndDelete({ id });
    if (!comment && mongoose.isValidObjectId(id)) {
      comment = await Comment.findByIdAndDelete(id);
    }
    return comment;
  }

  async voteComment(id: string, userId: string): Promise<ICommentDocument | null> {
    const comment = await this.findById(id);
    if (!comment) return null;

    if (!comment.upvotes) comment.upvotes = [];
    const index = comment.upvotes.indexOf(userId);
    if (index > -1) {
      comment.upvotes.splice(index, 1);
    } else {
      comment.upvotes.push(userId);
    }

    return await comment.save();
  }
}

export const commentRepository = new CommentRepository();
export default commentRepository;
