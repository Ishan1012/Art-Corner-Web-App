import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IPost } from '../types';

export interface IPostDocument extends Omit<IPost, '_id' | 'id'>, Document {
  id?: any;
}

const postSchema = new Schema<IPostDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    communityId: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, default: 'Anonymous' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    img: { type: String, default: '' },
    upvotes: [{ type: String }],
    downvotes: [{ type: String }],
    commentCount: { type: Number, default: 0 },
    flair: { type: String, default: 'General' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.index({ communityId: 1, createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model<IPostDocument>('Post', postSchema);

export default Post;
export { Post };
