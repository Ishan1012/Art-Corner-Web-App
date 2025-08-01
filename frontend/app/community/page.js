import CommunityPage from '@/components/community-forum/community-page/CommunityPage'
import { Header } from '@/components/Header'
import React from 'react'

export default function Community() {
  return (
    <div>
        <Header open={4} />
        <div style={{marginTop: 60}}>
            <CommunityPage />
        </div>
    </div>
  )
}
