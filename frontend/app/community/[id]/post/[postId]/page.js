'use client';
import PostDetailPage from '@/components/community-forum/post-detail/PostDetailPage';
import { Header } from '@/components/Header';
import { useParams } from 'next/navigation';
import React from 'react';

export default function PostDetail() {
  const params = useParams();
  const id = params.id;
  const postId = params.postId;

  return (
    <div>
      <Header open={5} />
      <div style={{ paddingTop: 60 }}>
        <PostDetailPage communityId={id} postId={postId} />
      </div>
    </div>
  );
}
