import { POSTS_URL } from '@/shared/constants/urls';
import { toast } from 'react-toastify';

export async function getPostsByCommunity(communityId) {
  try {
    const res = await fetch(`${POSTS_URL}/community/${communityId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    return [];
  }
}

export async function getPostById(postId) {
  try {
    const res = await fetch(`${POSTS_URL}/${postId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch post:', err);
    return null;
  }
}

export async function createPost(postForm) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(POSTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(postForm),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || 'Failed to create post');
      return null;
    }
    toast.success('Post created successfully!');
    return data;
  } catch (err) {
    toast.error('Error creating post: ' + err.message);
    return null;
  }
}

export async function votePost(postId, userId, type) {
  try {
    const res = await fetch(`${POSTS_URL}/${postId}/vote`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to vote:', err);
    return null;
  }
}

export async function deletePost(postId) {
  try {
    const res = await fetch(`${POSTS_URL}/${postId}`, { method: 'DELETE' });
    if (!res.ok) return false;
    toast.info('Post deleted');
    return true;
  } catch (err) {
    console.error('Failed to delete post:', err);
    return false;
  }
}
