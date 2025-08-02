'use client';
import React, { useEffect, useState } from 'react'
import '@/styles/CommunityPage.css'
import getAll from '@/services/CommunityService';
import { useRouter } from 'next/navigation';

export default function CommunityPage({ id }) {
    const [communities, setCommunities] = useState([]);
    const router = useRouter();

    useEffect(()=> {
        const data=getAll();
        setCommunities(data);
    }, []);

    const getSummary = (description) => {
        return description.substring(0, 218);
    }

    const OpenCommunityPage = (item) => {
        router.push('/community/'+item.id);
    }

    return (
        <div>
            <div className="container-fluid text-center">
                <br />
                <h1 className="text-center">Inspire & Collaborate</h1>
                <br />
                <div className="row g-4 justify-content-center text-center">
                    {
                        communities.map((item, index) => (
                            <div key={index} className="col-xl-3 col-lg-4 col-md-5 col-sm-7 col-7">
                                <div className="content2 content2-1 text-center" style={{width: 290}}>
                                    <div className="card-body text-center mb-3">
                                        <img src={item.img} alt={item.name} />
                                        <h5 className="card-title mt-3 mb-3">{item.name}</h5>
                                        <p className="edit-card-text card-text mb-4">{getSummary(item.desc)}</p>
                                        <div className="edit-btn">
                                            <div onClick={() => JoinCommunity(item)} className="btn btn-outline-primary">Join</div>
                                            <div onClick={() => OpenCommunityPage(item)} className="btn btn-outline-primary">Visit</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <br /><br />
        </div>
    )
}
