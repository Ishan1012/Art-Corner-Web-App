'use client';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import React, { useEffect, useState } from 'react';
import '@/styles/CommunityDescriptionPage.css';
import ErrorPage from '@/components/accessibility-features/error-page/ErrorPage';
import { getCommunity, joinCommunity, leaveCommunity } from '@/services/CommunityService';
import { getPostsByCommunity, createPost } from '@/services/PostService';
import { getUser } from '@/services/UserService';
import { toast } from 'react-toastify';
import PostCard from '../post-card/PostCard';

export default function CommunityDescriptionPage({ id }) {
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [unavail, setUnavail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [sort, setSort] = useState('new'); // 'hot', 'new', 'top'

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImg, setPostImg] = useState('');
  const [postFlair, setPostFlair] = useState('Discussion');
  const [submittingPost, setSubmittingPost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const communityData = await getCommunity(id);
        const userData = getUser();

        if (!communityData || (!communityData.id && !communityData._id)) {
          setUnavail(true);
        } else {
          setCommunity(communityData);
          if (userData && (userData._id || userData.id)) {
            setUser(userData);
            const userId = userData._id || userData.id;
            const checkIsMember = (communityData.members || []).some(
              (m) => m === userId || m._id === userId || (m.toString && m.toString() === userId)
            );
            setIsMember(checkIsMember);
          }

          // Fetch posts
          const communityPosts = await getPostsByCommunity(id);
          setPosts(communityPosts);
        }
      } catch (err) {
        toast.error('Error loading community data');
        setUnavail(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (unavail) return <ErrorPage />;
  if (loading) return <LoadingPage />;

  const handleJoin = async () => {
    if (!user) {
      toast.info('Please log in to join');
      return;
    }
    const response = await joinCommunity(id, user);
    if (response.success) {
      toast.success('Joined community!');
      setIsMember(true);
      if (response.data) setCommunity(response.data);
    } else if (response.alreadyJoined) {
      toast.info('Already a member.');
      setIsMember(true);
    } else {
      toast.error('Failed to join community.');
    }
  };

  const handleLeave = async () => {
    const response = await leaveCommunity(id, user);
    if (response.success) {
      toast.info('Left community.');
      setIsMember(false);
      if (response.data) setCommunity(response.data);
    } else {
      toast.error('Failed to leave community.');
    }
  };

  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      toast.error('Title and Content are required');
      return;
    }

    setSubmittingPost(true);
    const newPost = await createPost({
      communityId: id,
      authorId: user._id || user.id,
      authorName: user.username || user.name || 'Artist',
      title: postTitle,
      content: postContent,
      img: postImg,
      flair: postFlair,
    });

    setSubmittingPost(false);
    if (newPost) {
      setPosts([newPost, ...posts]);
      setPostTitle('');
      setPostContent('');
      setPostImg('');
      setShowCreateModal(false);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sort === 'new') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sort === 'top') {
      const scoreA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
      const scoreB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
      return scoreB - scoreA;
    } else {
      // Hot: combined score & recency
      const scoreA = (a.upvotes?.length || 0) + (a.commentCount || 0);
      const scoreB = (b.upvotes?.length || 0) + (b.commentCount || 0);
      return scoreB - scoreA;
    }
  });

  const getAboutSummary = (text) => {
    if (!text) return 'Welcome to this creative art space!';
    const words = text.trim().split(/\s+/);
    if (words.length <= 50) return text;
    return words.slice(0, 50).join(' ') + '...';
  };

  return (
    <div className="community-detail-container">
      {/* Banner */}
      <div
        className="community-hero-banner"
        style={{ backgroundImage: community.banner ? `url(${community.banner})` : undefined }}
      ></div>

      {/* Header Bar */}
      <div className="community-header-bar">
        <img
          src={community.img || '/profiles/profile1.png'}
          alt={community.name}
          className="community-header-avatar"
        />
        <div className="community-header-info">
          <h1 className="community-header-name">c/{community.name}</h1>
          <div className="community-header-stats">
            <i className="bi bi-people-fill me-1"></i>
            {(community.members || []).length} Members
          </div>
        </div>

        <div>
          {!isMember ? (
            <button onClick={handleJoin} className="btn btn-primary rounded-pill px-4 fw-semibold">
              <i className="bi bi-plus-lg me-1"></i> Join
            </button>
          ) : (
            <button onClick={handleLeave} className="btn btn-outline-danger rounded-pill px-4 fw-semibold">
              Leave
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Main Content */}
      <div className="row g-4">
        {/* Left Column: Feed */}
        <div className="col-lg-8">
          {/* Create Post Trigger */}
          <div className="create-post-trigger" onClick={() => (user ? setShowCreateModal(true) : toast.info('Please log in to post'))}>
            <div className="post-author-avatar">{user ? (user.username || 'U')[0].toUpperCase() : 'Guest'}</div>
            <input type="text" placeholder={isMember ? 'Create a post...' : 'Join community to create a post'} readOnly />
            <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
              <i className="bi bi-pencil-square"></i> Post
            </button>
          </div>

          {/* Sort Tabs */}
          <div className="feed-sort-bar">
            <button className={`sort-tab ${sort === 'new' ? 'active' : ''}`} onClick={() => setSort('new')}>
              <i className="bi bi-brightness-high"></i> New
            </button>
            <button className={`sort-tab ${sort === 'hot' ? 'active' : ''}`} onClick={() => setSort('hot')}>
              <i className="bi bi-fire"></i> Hot
            </button>
            <button className={`sort-tab ${sort === 'top' ? 'active' : ''}`} onClick={() => setSort('top')}>
              <i className="bi bi-graph-up-arrow"></i> Top
            </button>
          </div>

          {/* Post Feed */}
          {sortedPosts.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-chat-left-dots display-3 mb-3 d-block"></i>
              <h5>No posts yet</h5>
              <p>Be the first to start a conversation in c/{community.name}!</p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostCard key={post.id || post._id} post={post} user={user} communityId={id} />
            ))
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="col-lg-4">
          <div className="sidebar-box">
            <h5 className="sidebar-title">About Community</h5>
            <p className="sidebar-desc">{getAboutSummary(community.description)}</p>

            <div className="d-flex align-items-center gap-3 text-secondary mb-3 small">
              <div>
                <i className="bi bi-calendar3 me-1"></i> Created{' '}
                {new Date(community.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>

            <button
              className="btn btn-primary w-100 rounded-pill fw-semibold mb-2"
              onClick={() => (user ? setShowCreateModal(true) : toast.info('Please log in to post'))}
            >
              Create Post
            </button>
          </div>

          {/* Community Rules */}
          {community.rules && community.rules.length > 0 && (
            <div className="sidebar-box">
              <h5 className="sidebar-title">Community Rules</h5>
              <ol className="ps-3 mb-0 text-secondary small">
                {community.rules.map((rule, idx) => (
                  <li key={idx} className="mb-2">
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">Create a post in c/{community.name}</h5>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}></button>
            </div>

            <form onSubmit={handleCreatePostSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Flair</label>
                <select
                  className="form-select"
                  value={postFlair}
                  onChange={(e) => setPostFlair(e.target.value)}
                >
                  <option value="Discussion">Discussion</option>
                  <option value="Showcase">Showcase</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Question">Question</option>
                  <option value="Feedback">Feedback</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title of your post..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Content</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Share your thoughts, artwork description, or ask questions..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/art.jpg"
                  value={postImg}
                  onChange={(e) => setPostImg(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4"
                  disabled={submittingPost}
                >
                  {submittingPost ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
