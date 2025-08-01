'use client';
import React, { useEffect, useState } from 'react'
import '@/styles/ExplorePage.css';
import getAll, { searchArtifacts } from '@/services/ArtifactsService';
import { useRouter } from 'next/navigation';
import { addBookmark, getAllBookmarks, removeBookmark } from '@/services/BookmarksService';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';

export default function SearchPage({ query }) {
    const [artifacts, setArtifacts] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const loadData = () => {
            const data2 = getAllBookmarks();
            setBookmarks(data2);

            const data = searchArtifacts(query);
            console.log(data);
            setBookmarksList(data, data2);
            setArtifacts(data);
        }

        loadData();
    }, []);

    if (!artifacts || !bookmarks) {
        return <LoadingPage />;
    }

    const setBookmarksList = (list1, list2) => {
        list1.forEach(element => {
            if (list2.some(item => item._id === element._id)) {
                element.bookmark = true;
            }
        });
    }

    const readMore = (item) => {
        router.push('/explore/' + item.id);
    }

    const toggleBookmark = (item) => {
        const exists = bookmarks.some(bookmark => bookmark._id === item._id);

        if (!exists) {
            item.bookmark = true;
            addBookmark(item);

            const updatedBookmarks = getAllBookmarks();
            setBookmarks(updatedBookmarks);
        } else {
            removeBookmark(item._id);

            const updatedBookmarks = getAllBookmarks();
            setBookmarks(updatedBookmarks);
        }

        const updatedArtifacts = artifacts.map(artifact => {
            if (artifact._id === item._id) {
                return { ...artifact, bookmark: !exists };
            }
            return artifact;
        });

        setArtifacts(updatedArtifacts);
    };

    return (
        <div className="container-fluid">
            <br />
            <h1 className="text-center">Art Gallery</h1>
            <br />
            <div className="edit-container">
                <div className="row g-4 d-flex justify-content-center">
                    {
                        artifacts.map((item, index) => (
                            <div key={index} className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-12" >
                                <div className="card text-center h-100" style={{ overflow: "hidden" }}>
                                    <img src={'/'+item.img} loading="lazy" className="card-img-top img-fit" alt="Image" onClick={() => readMore(item)} />
                                    <div className="card-body edit-card-body">
                                        <h5 className="card-title">{item.title}</h5>
                                        <div className="btn-styles text-end fw-normal">
                                            <div className="btn btn-outline-primary" onClick={() => readMore(item)}>Preview</div>
                                            {
                                                item.bookmark ?
                                                    <div className="btn btn-outline-warning" onClick={() => toggleBookmark(item)}>
                                                        <i className="bi bi-bookmark-fill"></i>
                                                    </div> :
                                                    <div className="btn btn-outline-warning" onClick={() => toggleBookmark(item)}>
                                                        <i className="bi bi-bookmark"></i>
                                                    </div>
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
        </div>
    )
}
