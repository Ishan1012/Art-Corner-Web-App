import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Post, { IPostDocument } from '../models/Post';
import { IPost } from '../types';

export class PostRepository {
  async findById(id: string): Promise<IPostDocument | null> {
    if (!id) return null;
    let post = await Post.findOne({ id });
    if (!post && mongoose.isValidObjectId(id)) {
      post = await Post.findById(id);
    }
    return post;
  }

  async findByCommunity(communityId: string): Promise<IPostDocument[]> {
    return await Post.find({ communityId }).sort({ createdAt: -1 });
  }

  async createPost(data: Partial<IPost>): Promise<IPostDocument> {
    const postData = { ...data };
    if (!postData.id) {
      postData.id = uuidv4();
    }
    return await Post.create(postData);
  }

  async deletePost(id: string): Promise<IPostDocument | null> {
    if (!id) return null;
    let post = await Post.findOneAndDelete({ id });
    if (!post && mongoose.isValidObjectId(id)) {
      post = await Post.findByIdAndDelete(id);
    }
    return post;
  }

  async votePost(id: string, userId: string, type: 'up' | 'down'): Promise<IPostDocument | null> {
    const post = await this.findById(id);
    if (!post) return null;

    if (!post.upvotes) post.upvotes = [];
    if (!post.downvotes) post.downvotes = [];

    const upIndex = post.upvotes.indexOf(userId);
    const downIndex = post.downvotes.indexOf(userId);

    if (type === 'up') {
      if (upIndex > -1) {
        post.upvotes.splice(upIndex, 1); // toggle off
      } else {
        post.upvotes.push(userId);
        if (downIndex > -1) post.downvotes.splice(downIndex, 1);
      }
    } else {
      if (downIndex > -1) {
        post.downvotes.splice(downIndex, 1); // toggle off
      } else {
        post.downvotes.push(userId);
        if (upIndex > -1) post.upvotes.splice(upIndex, 1);
      }
    }

    return await post.save();
  }

  async incrementCommentCount(id: string, delta: number = 1): Promise<void> {
    const post = await this.findById(id);
    if (post) {
      post.commentCount = Math.max(0, (post.commentCount || 0) + delta);
      await post.save();
    }
  }
}

export const postRepository = new PostRepository();
export default postRepository;
