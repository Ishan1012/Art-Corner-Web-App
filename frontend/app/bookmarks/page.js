import BookmarkPage from '@/components/accessibility-features/bookmarks-page/BookmarkPage'
import { Header } from '@/components/Header'
import React from 'react'

export default function Bookmark() {
  return (
    <div>
        <Header open={4} />
        <div style={{marginTop: 60}}>
            <BookmarkPage />
        </div>
    </div>
  )
}
