'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import '@/styles/BookmarkPage.css'
import { addBookmark, getAllBookmarks, removeBookmark } from '@/services/BookmarksService';
import { LoadingPage } from '../loading-page/LoadingPage';
import { useRouter } from 'next/navigation';

export default function BookmarkPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = getAllBookmarks();

            if (data.length > 0) {
                setBookmarks(data);
            } else {
                console.log('No bookmarks found in localStorage');
            }
        }
    }, []);

    if(!bookmarks) {
        return <LoadingPage />;
    }


    const toggleBookmark = (item) => {
        const exists = bookmarks.some(bookmark => bookmark._id === item._id);

        if (!exists) {
            addBookmark(item);

            const updatedBookmarks = getAllBookmarks();
            setBookmarks(updatedBookmarks);
        } else {
            removeBookmark(item._id);

            const updatedBookmarks = getAllBookmarks();
            setBookmarks(updatedBookmarks);
        }
    };

    const readMore = (item) => {
        router.push('/explore/'+item._id);
    }

    return (
        <div>
            {
                !bookmarks || bookmarks.length === 0 ?
                    (
                        <div className="container">
                            <div className="main d-flex justify-self-center">
                                <div className="heading">
                                    <h2>No favourites yet</h2>
                                </div>
                                <div className="disc text-center">
                                    <p>Use the favourite button to save artworks, stories, collection and more</p>
                                </div>
                                <div>
                                    <Link className="button" type="submit" href="/explore">Start
                                        Exploring</Link>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div>
                            <div className="container-fluid">
                                <br />
                                <h1 style={{ paddingLeft: 30 }}>Bookmarks</h1>
                                <br />
                                <div className="row g-4 justify-content-center">
                                    {
                                        bookmarks.map((item, index) => (
                                            <div key={index}
                                                className="col-xl-3 col-lg-4 col-md-5 col-sm-7 col-auto">
                                                <div className="card text-center" style={{ width: 280, overflow: 'hidden' }}>
                                                    <img src={item.img} className="card-img-top img-fit" alt="Image" onClick={() => readMore(item)} />
                                                    <div className="card-body edit-card-body">
                                                        <h5 className="card-title">{item.title}</h5>
                                                        <div className="btn-styles text-end">
                                                            <Link className="btn btn-outline-primary" href={`/explore/${item._id}`}>Preview</Link>
                                                            {
                                                                item.bookmark ?
                                                                    (
                                                                        <div className="btn btn-outline-warning" onClick={() => toggleBookmark(item)}>
                                                                            <i className="bi bi-bookmark-fill"></i>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="btn btn-outline-warning" onClick={() => toggleBookmark(item)}>
                                                                            <i className="bi bi-bookmark"></i>
                                                                        </div>
                                                                    )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <br /><br />
                        </div >
                    )

            }
        </div >
    )
}
