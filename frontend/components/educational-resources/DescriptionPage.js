import getAll, { addLike, getArtifactById, removeLike } from '@/services/ArtifactsService';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import '@/styles/DescriptionPage.css';
import { LoadingPage } from '../accessibility-features/loading-page/LoadingPage';
import { useRouter } from 'next/navigation';
import ErrorPage from '../accessibility-features/error-page/ErrorPage';
import { getUser } from '@/services/UserService';

export default function DescriptionPage({ id }) {
    const [user, setUser] = useState(null);
    const [recommendList, setRecommendList] = useState([]);
    const [showArtifact, setShowArtifact] = useState(null);
    const [nextId, setNextId] = useState(null);
    const [prevId, setPrevId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [iscopy, setIscopy] = useState(false);
    const [unavail, setUnavail] = useState(false);

    const router = useRouter();
    const isActive = true;
    let isFading = false;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAll();
                const found = await getArtifactById(id);

                if (!found || !found._id) {
                    setUnavail(true);
                    return;
                }

                const currentIndex = data.findIndex(item => item._id === found._id);

                if (currentIndex === -1) {
                    setUnavail(true);
                    return;
                }

                const nextIndex = (currentIndex + 1) % data.length;
                const prevIndex = (currentIndex - 1 + data.length) % data.length;

                const next = data[nextIndex]._id;
                const prev = data[prevIndex]._id;

                setPrevId(prev);
                setNextId(next);
                setShowArtifact(found);

                const shuffled = data
                    .filter(item => item.id !== id)
                    .sort(() => Math.random() - 0.5);

                setRecommendList(shuffled.slice(0, 8));
            } catch (error) {
                console.error("Error fetching data:", error);
                setUnavail(true);
            }
        };

        const fetchUser = async () => {
            const data = await getUser();

            if (data && data._id) {
                setUser(data);
            }
        };

        fetchUser();
        fetchData();
    }, [id]);



    if (unavail) {
        return <ErrorPage />;
    }

    if (!showArtifact && isLoading) {
        return <LoadingPage />;
    }

    const toggleLike = () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (showArtifact.like.some((item) => item.id === user.id)) {
            removeLike(showArtifact.id, user.id);
            setShowArtifact(prev => ({
                ...prev,
                like: [...prev.like, user]
            }));
        }
        else {
            addLike(showArtifact, user);
            setShowArtifact(prev => ({
                ...prev,
                like: prev.like.filter(likeUser => likeUser.id !== user.id)
            }));
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const moveBack = () => {
        applyFadeEffect(() => {
            router.push(`/explore/${prevId}`);
        })
    };

    const moveNext = () => {
        applyFadeEffect(() => {
            router.push(`/explore/${nextId}`);
        })
    };

    const applyFadeEffect = (action) => {
        isFading = true;

        setTimeout(() => {
            action();

            setTimeout(() => {
                isFading = false;
            }, 50);
        }, 500);
    };

    const downloadImage = () => {
        if (!showArtifact?.img) return;

        const isBase64 = showArtifact.img.startsWith('data:image');

        // Create a download link
        const link = document.createElement('a');

        if (isBase64) {
            // Base64 image
            link.href = showArtifact.img;
            link.download = `${showArtifact.title?.replace(/\s+/g, '_') || 'download'}.png`;
        } else {
            // Static image path like /img/img123.png
            const imagePath = showArtifact.img.startsWith('/')
                ? showArtifact.img
                : `/${showArtifact.img}`;
            link.href = imagePath;
            link.download = `${showArtifact.title?.replace(/\s+/g, '_') || 'download'}.png`;
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const openImage = (itemId) => {
        scrollToTop();
        router.push(`/explore/${itemId}`);
    }

    const copyToClipboard = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setIscopy(true);
            setTimeout(() => {
                setIscopy(false);
            }, 3000);

        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
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
                        <img src={showArtifact.img} loading="lazy"
                            className={`${!isFading && 'show'} img-edit mb-3 h-xl-10 h-md-20 h-sm-30`} alt="Image" style={{ padding: 0 }} onLoad={() => setIsLoading(false)} />
                    </div>
                    <div>
                        <h1 className="content-title">{showArtifact.title}</h1>
                    </div>
                </div>
                <div className="icon-bar d-flex justify-content-center gap-1">
                    <div className="btn" onClick={toggleLike}>
                        <i className={`bi fs-3 ${showArtifact.like.some(item => item.id === user.id) ? 'bi-heart-fill edit-heart' : 'bi-heart'}`}></i>
                    </div >
                    {
                        user ? (
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
                                                <img src={item.img} onClick={() => openImage(item.id)} className="img more-img" alt="image" />
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
