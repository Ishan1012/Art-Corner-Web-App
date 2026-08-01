import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IComment } from '../types';

export interface ICommentDocument extends Omit<IComment, '_id' | 'id'>, Document {
  id?: any;
}

const commentSchema = new Schema<ICommentDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    postId: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, default: 'Anonymous' },
    content: { type: String, required: true },
    upvotes: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ postId: 1, createdAt: 1 });

const Comment = mongoose.models.Comment || mongoose.model<ICommentDocument>('Comment', commentSchema);

export default Comment;
export { Comment };
