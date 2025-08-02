'use client'
import CommunityDescriptionPage from '@/components/community-forum/community-description/CommunityDescriptionPage'
import { Header } from '@/components/Header'
import { useParams } from 'next/navigation'
import React from 'react'

export default function CommunityDescription() {
    const params = useParams();
    const id = params.id;
    return (
        <div>
            <Header open={5} />
            <div style={{ paddingTop: 60 }}>
                <CommunityDescriptionPage id={id} />
            </div>
        </div>
    )
}
