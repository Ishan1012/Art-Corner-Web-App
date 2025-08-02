'use client';
import SearchPage from '@/components/accessibility-features/search-page/SearchPage'
import { Header } from '@/components/Header'
import { useParams } from 'next/navigation';
import React, { useState } from 'react'

export default function Search() {
    const params = useParams();
    const query = params.query;

    return (
        <div>
            <Header open={2} />
            <div style={{ marginTop: 60 }}>
                <SearchPage query={query} />
            </div>
        </div>
    )
}
