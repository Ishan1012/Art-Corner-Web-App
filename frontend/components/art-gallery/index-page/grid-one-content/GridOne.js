'use client';
import React, { useState } from 'react'
import '@/styles/GridOne.css';
import { useRouter } from 'next/navigation';

export default function GridOne() {
    const [user, setUser] = useState(null);

    const router = useRouter();
    const openLink = () => {
        if(!user) {
            router.push('/login');
        }
        else {
            router.push('/profile');
        }
    }
    return (
        <section className="sc-grid sc-grid-one">
            <div className="container">
                <div className="grid-content d-grid align-items-center">
                    <div className="grid-img">
                        <img src="./icon/grid-two.png" alt="" />
                    </div>
                    <div className="grid-text">
                        <div className="content-wrapper text-start btn-container">
                            <div className="title-box">
                                <h3 className="title-box-name">Showcase Creativity with Stunning Visuals</h3>
                                <br />
                            </div>

                            <p className="text title-box-text">Start your Art Corner journey with a captivating hero section
                                featuring high-quality images or a dynamic carousel. Highlight breathtaking artworks,
                                upcoming art events, or artist spotlights to immediately engage visitors. The visuals should
                                evoke emotion and curiosity, inviting users to explore further. Paired with compelling
                                headlines and calls-to-action, this section sets the tone for the artistic experience ahead.
                            </p>
                            <div className="btn btn-outline-dark" onClick={() => openLink()}>Learn more</div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}
