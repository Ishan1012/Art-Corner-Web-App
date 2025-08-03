'use client';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import React, { useEffect, useState } from 'react'
import '@/styles/CommunityDescriptionPage.css';
import Link from 'next/link';
import ErrorPage from '@/components/accessibility-features/error-page/ErrorPage';
import { getCommunity, joinCommunity, leaveCommunity } from '@/services/CommunityService';
import { useRouter } from 'next/navigation';
import { getUser } from '@/services/UserService';
import { toast } from 'react-toastify';

export default function CommunityDescriptionPage({ id }) {
    const [community, setCommunity] = useState(null);
    const [user, setUser] = useState(null);
    const [unavail, setUnavail] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const communityData = await getCommunity(id);
                const userData = getUser();

                if (!communityData || !communityData.id) {
                    setUnavail(true);
                } else {
                    setCommunity(communityData);
                    if (userData && userData._id) {
                        setUser(userData);

                        const userId = userData._id;
                        const checkIsMember = communityData.members?.some(member =>
                            member === userId || member._id === userId
                        );
                        setIsMember(checkIsMember);
                    }
                }
            } catch (err) {
                toast.error("Error fetching community or user:", err);
                setUnavail(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    if (unavail) {
        return <ErrorPage />;
    }

    if (loading) {
        return <LoadingPage />;
    }

    const handleJoin = async () => {
        const response = await joinCommunity(id, user);

        if (response.success) {
            toast.success("Successfully joined the community.");
            setIsMember(true);
            setCommunity(response.data);
        } else if (response.alreadyJoined) {
            toast.info("You have already joined the community.");
            setIsMember(true);
        } else {
            toast.error("Failed to join community.");
        }
    }

    const handleLeave = async () => {
        const response = await leaveCommunity(id, user);

        if (response.success) {
            toast.info("You have left the community.");
            setIsMember(false);
            setCommunity(response.data);
        } else {
            toast.error("Failed to join community."+response.reason);
        }
    }

    return (
        <div className="container edit-container">
            <div className="img-container text-center">
                <img src={community.img} alt="" />
            </div>
            <div className="container text-center edit-text mb-5">
                <h1>{community.name}</h1>
            </div>
            <div className="edit-description mt-5 mb-3">
                {community.description}
            </div>
            <div className="text-center mt-3">
                {
                    !isMember ? (
                        <div onClick={handleJoin} className="btn btn-primary">Join now</div>
                    ) : (
                        <div onClick={handleLeave} className="btn btn-danger">Leave</div>
                    )
                }
            </div>
            <div className="text-center mt-3 mb-5">
                <p>Total members joined: {community.members.length}</p>
            </div>
        </div>
    )
}
