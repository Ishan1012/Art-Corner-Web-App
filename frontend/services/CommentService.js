import { COMMENTS_URL } from '@/shared/constants/urls';
import { toast } from 'react-toastify';

export async function getCommentsByPost(postId) {
  try {
    const res = await fetch(`${COMMENTS_URL}/post/${postId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch comments:', err);
    return [];
  }
}

export async function createComment(commentForm) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(COMMENTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(commentForm),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || 'Failed to add comment');
      return null;
    }
    toast.success('Comment added!');
    return data;
  } catch (err) {
    toast.error('Error adding comment: ' + err.message);
    return null;
  }
}

export async function voteComment(commentId, userId) {
  try {
    const res = await fetch(`${COMMENTS_URL}/${commentId}/vote`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to vote comment:', err);
    return null;
  }
}

export async function deleteComment(commentId) {
  try {
    const res = await fetch(`${COMMENTS_URL}/${commentId}`, { method: 'DELETE' });
    if (!res.ok) return false;
    toast.info('Comment deleted');
    return true;
  } catch (err) {
    console.error('Failed to delete comment:', err);
    return false;
  }
}
