'use client';
import React, { useEffect, useState } from 'react';
import '@/styles/PostDetailPage.css';
import { getPostById, votePost } from '@/services/PostService';
import { getCommentsByPost, createComment, voteComment } from '@/services/CommentService';
import { getUser } from '@/services/UserService';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import ErrorPage from '@/components/accessibility-features/error-page/ErrorPage';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function PostDetailPage({ communityId, postId }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavail, setUnavail] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getPostById(postId);
        const uData = getUser();
        if (!postData) {
          setUnavail(true);
        } else {
          setPost(postData);
          if (uData && (uData._id || uData.id)) {
            setUser(uData);
          }
          const commentList = await getCommentsByPost(postId);
          setComments(commentList);
        }
      } catch (err) {
        setUnavail(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  if (unavail) return <ErrorPage />;
  if (loading) return <LoadingPage />;

  const userId = user?._id || user?.id;

  const handleVotePost = async (type) => {
    if (!userId) {
      toast.info('Please log in to vote');
      return;
    }
    const updated = await votePost(postId, userId, type);
    if (updated) setPost(updated);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.info('Please log in to comment');
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    const newComment = await createComment({
      postId,
      authorId: userId,
      authorName: user.username || user.name || 'Artist',
      content: commentText,
    });
    setSubmittingComment(false);

    if (newComment) {
      setComments([...comments, newComment]);
      setCommentText('');
      setPost((prev) => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
    }
  };

  const handleVoteComment = async (cId) => {
    if (!userId) {
      toast.info('Please log in to upvote comments');
      return;
    }
    const updated = await voteComment(cId, userId);
    if (updated) {
      setComments((prev) => prev.map((c) => (c.id === cId || c._id === cId ? updated : c)));
    }
  };

  const upvotes = post.upvotes || [];
  const downvotes = post.downvotes || [];
  const score = upvotes.length - downvotes.length;
  const isUpvoted = userId ? upvotes.includes(userId) : false;
  const isDownvoted = userId ? downvotes.includes(userId) : false;

  return (
    <div className="post-detail-container">
      <Link href={`/community/${communityId}`} className="back-link">
        <i className="bi bi-arrow-left"></i> Back to c/Community
      </Link>

      <div className="post-detail-card">
        <div className="post-card-header mb-3">
          <div className="post-author-avatar">{(post.authorName || 'A')[0].toUpperCase()}</div>
          <span className="fw-semibold text-dark">{post.authorName || 'Anonymous'}</span>
          <span>•</span>
          <span>{new Date(post.createdAt || Date.now()).toLocaleString()}</span>
          {post.flair && <span className="post-flair ms-auto">{post.flair}</span>}
        </div>

        <h1 className="post-detail-title">{post.title}</h1>
        <p className="post-detail-body">{post.content}</p>

        {post.img && <img src={post.img} alt={post.title} className="post-detail-img" />}

        <div className="post-footer">
          <div className="vote-box">
            <button
              className={`vote-btn ${isUpvoted ? 'up-active' : ''}`}
              onClick={() => handleVotePost('up')}
            >
              <i className={`bi ${isUpvoted ? 'bi-caret-up-fill' : 'bi-caret-up'}`}></i>
            </button>
            <span className="vote-score">{score}</span>
            <button
              className={`vote-btn ${isDownvoted ? 'down-active' : ''}`}
              onClick={() => handleVotePost('down')}
            >
              <i className={`bi ${isDownvoted ? 'bi-caret-down-fill' : 'bi-caret-down'}`}></i>
            </button>
          </div>

          <div className="comments-chip">
            <i className="bi bi-chat-left-text"></i>
            <span>{post.commentCount || 0} Comments</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h5 className="fw-bold mb-3 text-dark">Comments</h5>

        <form onSubmit={handleAddComment} className="comment-input-box">
          <textarea
            rows="3"
            placeholder={userId ? 'Add a comment...' : 'Log in to join the discussion'}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!userId}
          ></textarea>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
              disabled={!userId || submittingComment || !commentText.trim()}
            >
              {submittingComment ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="text-secondary small">No comments yet. Be the first to reply!</p>
        ) : (
          comments.map((comment) => {
            const cUpvotes = comment.upvotes || [];
            const cIsUpvoted = userId ? cUpvotes.includes(userId) : false;
            return (
              <div key={comment.id || comment._id} className="comment-item">
                <div>
                  <span className="comment-author">{comment.authorName || 'Artist'}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="comment-text">{comment.content}</p>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <button
                    className={`btn btn-sm p-0 ${cIsUpvoted ? 'text-primary' : 'text-secondary'}`}
                    onClick={() => handleVoteComment(comment.id || comment._id)}
                  >
                    <i className={`bi ${cIsUpvoted ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>{' '}
                    <span className="small">{cUpvotes.length}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
