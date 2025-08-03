'use client';
import React, { useEffect, useState } from 'react'
import '@/styles/CommunityPage.css'
import getAll, { joinCommunity } from '@/services/CommunityService';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import { toast } from 'react-toastify';
import { getUser } from '@/services/UserService';

export default function CommunityPage() {
    const [user, setUser] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCommunities = async () => {
            const data = await getAll();

            if (!data || data.length === 0) {
                setLoading(false);
                return;
            }
            
            setCommunities(data);
            setLoading(false);
        };

        const fetchUser = () => {
            const data = getUser();

            if (data && data._id) {
                setUser(data);
            }
        };

        fetchCommunities();
        fetchUser();
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    const getSummary = (description) => {
        return description.substring(0, 218);
    }

    const OpenCommunityPage = (item) => {
        router.push('/community/' + item.id);
    }

    const handleJoin = async (itemId) => {
        const response = await joinCommunity(itemId, user);

        if(response.success) {
            toast.success("Successfully joined the community.");
        } else if(response.alreadyJoined) {
            toast.info("You have already joined the community.");
        } else {
            toast.error("Failed to join community.");
        }
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
                                <div className="content2 content2-1 text-center" style={{ width: 290 }}>
                                    <div className="card-body text-center mb-3">
                                        <img src={item.img} alt={item.name} />
                                        <h5 className="card-title mt-3 mb-3">{item.name}</h5>
                                        <p className="edit-card-text card-text mb-4">{getSummary(item.description)}</p>
                                        <div className="edit-btn">
                                            <div onClick={() => handleJoin(item.id)} className="btn btn-outline-primary">Join</div>
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
