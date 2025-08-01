import getAll, { addLike, removeLike } from '@/services/ArtifactsService';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import '@/styles/DescriptionPage.css';
import { LoadingPage } from '../accessibility-features/loading-page/LoadingPage';
import { useRouter } from 'next/navigation';

export default function DescriptionPage({ id }) {
    const [user, setUser] = useState(null);
    const [recommendList, setRecommendList] = useState([]);
    const [showArtifact, setShowArtifact] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [iscopy, setIscopy] = useState(false);

    const router = useRouter();
    const isActive = true;
    const isFading = false;

    useEffect(() => {
        const data = getAll();
        const found = data.find((item) => item._id === id);
        setShowArtifact(found);
        setUser({ _id: '1', name: 'a' });

        const shuffled = data
            .filter(item => item.id !== id)
            .sort(() => Math.random() - 0.5);

        setRecommendList(shuffled.slice(0, 8));

    }, []);

    if (!showArtifact && isLoading) {
        return <LoadingPage />;
    }

    const toggleLike = () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (showArtifact.like.some((item) => item._id === user._id)) {
            removeLike(showArtifact._id, user._id);
            setShowArtifact(prev => ({
                ...prev,
                like: [...prev.like, user]
            }));
        }
        else {
            addLike(showArtifact, user);
            setShowArtifact(prev => ({
                ...prev,
                like: prev.like.filter(likeUser => likeUser._id !== user._id)
            }));
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }


    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = `/${showArtifact.img}`;
        link.download = showArtifact.title || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const activeDownload = () => true;

    const openImage = (itemId) => {
        scrollToTop();
        router.push(`/explore/${itemId}`);
    }

    return (
        <div>
            <div className="container text-center mt-3 mx-auto container-edit">
                {
                    isActive &&
                    (
                        <div className="container container-space mt-3">
                            <div className="btn btn-danger button-edit" onClick={() => moveBack()}>Previous</div>
                            <div className="btn btn-danger button-edit" onClick={() => moveNext()}>Next</div>
                        </div>
                    )
                }
                <br />
                <div className="title-image-wrapper d-flex align-items-center flex-column">
                    <div>
                        <img src={'/' + showArtifact.img} loading="lazy"
                            className={`${!isFading && 'show'} img-edit mb-3 h-xl-10 h-md-20 h-sm-30`} alt="Image" style={{ padding: 0 }} onLoad={() => setIsLoading(false)} />
                    </div>
                    <div>
                        <h1 className="content-title">{showArtifact.title}</h1>
                    </div>
                </div>
                <div className="icon-bar d-flex justify-content-center gap-1">
                    <div className="btn" onClick={toggleLike}>
                        <i className={`bi fs-3 ${showArtifact.like.some(item => item._id === user._id) ? 'bi-heart-fill edit-heart' : 'bi-heart'}`}></i>
                    </div >
                    {
                        activeDownload() ? (
                            <div onClick={() => downloadImage()} download={showArtifact.title} className="btn" > <i className="bi bi-download fs-3"></i></div>
                        ) : (
                            <Link href="/login" className="btn" ><i className="bi bi-download fs-3"></i></Link>
                        )
                    }
                    <Link target="_blank" href={'/'} className="btn"><i className="bi bi-instagram fs-3"></i></Link>
                    <Link target="_blank" href={'/'} className="btn"><i className="bi bi-twitter-x fs-3"></i></Link>
                    <div onClick={() => copyToClipboard()} className="btn" > <i className={`bi fs-3 ${!iscopy ? 'bi-clipboard' : 'bi-clipboard-check-fill'}`} ></i ></div>
                </div >
                <br />
                <p className="content-description">{showArtifact.desc}</p>
                <br />
                {
                    recommendList.length > 0 && (
                        <div>
                            <hr />
                            <h1 className="text-start content-title view-more">View More</h1>
                            <div className="row g-4 justify-content-center">
                                {
                                    recommendList.map((item, index) => (
                                        <div key={index} className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-12">
                                            <div className="card text-center h-100 img-container" style={{ overflow: 'hidden' }}>
                                                <img src={'/' + item.img} onClick={() => openImage(item._id)} className="img more-img" alt="image" />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <br />
            <br />
        </div>
    )
}
