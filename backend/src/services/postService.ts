import { postRepository } from '../repository/postRepository';
import { IPost } from '../types';

export class PostService {
  async getPostById(id: string) {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async getPostsByCommunity(communityId: string) {
    return await postRepository.findByCommunity(communityId);
  }

  async createPost(data: {
    communityId: string;
    authorId: string;
    authorName?: string;
    title: string;
    content: string;
    img?: string;
    flair?: string;
  }) {
    const { communityId, authorId, title, content } = data;
    if (!communityId || !authorId || !title || !content) {
      throw new Error('Community, author, title, and content are required');
    }

    return await postRepository.createPost(data);
  }

  async deletePost(id: string) {
    const post = await postRepository.deletePost(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async votePost(id: string, userId: string, type: 'up' | 'down') {
    if (!id || !userId) {
      throw new Error('Post ID and user ID are required');
    }
    const post = await postRepository.votePost(id, userId, type);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }
}

export const postService = new PostService();
export default postService;
