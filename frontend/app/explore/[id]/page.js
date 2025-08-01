'use client';
import DescriptionPage from '@/components/educational-resources/DescriptionPage';
import { Header } from '@/components/Header'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Description() {
    const params = useParams();
    const id = params.id;
    return (
        <div>
            <Header open={2} />
            <div style={{ paddingTop: 60 }}>
                <DescriptionPage id={id} />
            </div>
        </div>
    )
}
