'use client';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import getAll from '@/services/CommunityService';
import React, { useEffect, useState } from 'react'
import '@/styles/CommunityDescriptionPage.css';
import Link from 'next/link';

export default function CommunityDescriptionPage({ id }) {
    const [community, setCommunity] = useState([]);

    useEffect(() => {
        const data = getAll();
        const match = data.find((item) => item._id === id);
        setCommunity(match);
    }, []);

    if(!community) {
        return <LoadingPage />;
    }

    return (
        <div className="container edit-container">
            <div className="img-container text-center">
                <img src={'/'+community.img} alt="" />
            </div>
            <div className="container text-center edit-text mb-5">
                <h1>{community.name}</h1>
            </div>
            <div className="edit-description mt-5 mb-3">
                {community.desc}
            </div>
            <div className="text-center mt-3 mb-5">
                <Link href="" className="btn btn-primary">Join now</Link>
            </div>
        </div>
    )
}
