import NewsPage from '@/components/blog-news-section/NewsPage'
import { Header } from '@/components/Header'
import React from 'react'

export default function News() {
    return (
        <div>
            <Header />
            <div style={{ paddingTop: 60 }}>
                <NewsPage />
            </div>
        </div>
    )
}
