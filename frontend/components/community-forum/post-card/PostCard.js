'use client';
import React, { useState } from 'react';
import '@/styles/PostCard.css';
import { useRouter } from 'next/navigation';
import { votePost } from '@/services/PostService';

export default function PostCard({ post, user, communityId }) {
  const router = useRouter();
  const [upvotes, setUpvotes] = useState(post.upvotes || []);
  const [downvotes, setDownvotes] = useState(post.downvotes || []);

  const userId = user?._id || user?.id;
  const isUpvoted = userId ? upvotes.includes(userId) : false;
  const isDownvoted = userId ? downvotes.includes(userId) : false;

  const score = upvotes.length - downvotes.length;

  const handleVote = async (e, type) => {
    e.stopPropagation();
    if (!userId) {
      alert('Please log in to vote on posts');
      return;
    }

    // Optimistic update
    if (type === 'up') {
      if (isUpvoted) {
        setUpvotes(upvotes.filter((id) => id !== userId));
      } else {
        setUpvotes([...upvotes, userId]);
        setDownvotes(downvotes.filter((id) => id !== userId));
      }
    } else {
      if (isDownvoted) {
        setDownvotes(downvotes.filter((id) => id !== userId));
      } else {
        setDownvotes([...downvotes, userId]);
        setUpvotes(upvotes.filter((id) => id !== userId));
      }
    }

    const updated = await votePost(post.id || post._id, userId, type);
    if (updated) {
      setUpvotes(updated.upvotes || []);
      setDownvotes(updated.downvotes || []);
    }
  };

  const openPost = () => {
    router.push(`/community/${communityId}/post/${post.id || post._id}`);
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-author-avatar">{getInitials(post.authorName)}</div>
        <span className="fw-semibold text-dark">{post.authorName || 'Anonymous'}</span>
        <span>•</span>
        <span>{formatDate(post.createdAt)}</span>
        {post.flair && <span className="post-flair ms-auto">{post.flair}</span>}
      </div>

      <div className="post-title" onClick={openPost}>
        {post.title}
      </div>

      {post.content && (
        <div className="post-content-preview">
          {post.content.length > 280 ? `${post.content.substring(0, 280)}...` : post.content}
        </div>
      )}

      {post.img && (
        <div className="post-media-preview" onClick={openPost}>
          <img src={post.img} alt={post.title} />
        </div>
      )}

      <div className="post-footer">
        <div className="vote-box">
          <button
            className={`vote-btn ${isUpvoted ? 'up-active' : ''}`}
            onClick={(e) => handleVote(e, 'up')}
            title="Upvote"
          >
            <i className={`bi ${isUpvoted ? 'bi-caret-up-fill' : 'bi-caret-up'}`}></i>
          </button>
          <span className="vote-score">{score}</span>
          <button
            className={`vote-btn ${isDownvoted ? 'down-active' : ''}`}
            onClick={(e) => handleVote(e, 'down')}
            title="Downvote"
          >
            <i className={`bi ${isDownvoted ? 'bi-caret-down-fill' : 'bi-caret-down'}`}></i>
          </button>
        </div>

        <div className="comments-chip" onClick={openPost}>
          <i className="bi bi-chat-left-text"></i>
          <span>{post.commentCount || 0} Comments</span>
        </div>
      </div>
    </div>
  );
}
