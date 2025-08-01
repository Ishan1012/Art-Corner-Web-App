'use client';
import getAllNewsletters from '@/services/NewsLetterService';
import React, { useEffect, useState } from 'react'
import { LoadingPage } from '../accessibility-features/loading-page/LoadingPage';

export default function NewsPage() {
    const [newsletters, setNewsletters] = useState([]);

    useEffect(() => {
        const data = getAllNewsletters();
        setNewsletters(data);
    }, []);

    if (!newsletters || newsletters.length === 0) {
        return <LoadingPage />;
    }

    return (
        <div className="container">
            <br />
            <h1 className="text-center">Insights & Highlights</h1>
            <br />
            <div className="edit-container20">
                <div className="row g-4 d-flex justify-content-center">
                    {
                        newsletters.map((item, index) => (
                            <div key={index} className="card">
                                <h3 className="card-body">{item.title}</h3>
                                <div className="card-body">{item.desc}</div>
                            </div>

                        ))
                    }
                </div>
            </div>
            <br /><br />
        </div>
    )
}
