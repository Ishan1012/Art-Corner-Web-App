'use client';
import React, { useEffect, useRef, useState } from 'react';
import AdminDashboard from '../admin-login-dashboard/AdminDashboard';
import { getUser, logout } from '@/services/UserService';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import { toast } from 'react-toastify';
import '@/styles/UserDashboard.css';
import { useRouter } from 'next/navigation';
import UploadImageService from '@/services/UploadImageService';

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const dropRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        tags: [],
    });

    useEffect(() => {
        const fetchUser = () => {
            const data = getUser();

            if (data && data._id) {
                setUser(data);
            } else {
                toast.error('User not found or invalid credentials.');
                router.push('/');
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    if (user.isAdmin) {
        return <AdminDashboard />;
    }

    const handleTagKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().replace(/,/g, '');

            if (!formData.tags.includes(newTag)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag],
                }));
            }

            setTagInput('');
        }
    };

    const removeTag = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== indexToRemove),
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile || formData.title === '' || formData.desc === '') {
            console.log(selectedFile,formData);
            toast.error('Please fill all the details before submitting');
            return;
        }

        try {
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64Data = reader.result;
                const contentType = selectedFile.type;

                const payload = {
                    title: formData.title,
                    desc: formData.desc,
                    img: base64Data,
                    contentType,
                    tags: formData.tags || [],
                };

                try {
                    const response = await UploadImageService(payload);

                    if(response !== undefined) {
                        toast.success('Image uploaded successfully!');
                        router.push('/explore');
                    } else {
                        toast.error('An error occured. ');
                    }
                } catch (error) {
                    toast.error('Failed to upload image.');
                    console.error('Upload error:', error);
                }
            };

            reader.readAsDataURL(selectedFile); // read file as base64
        } catch (err) {
            toast.error('An error occurred while processing the image.');
            console.error(err);
        }
    };


    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            e.dataTransfer.clearData();
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogout = () => {
        try {
            const data = logout();

            if (data) {
                toast.info("Logged out");
                router.push('/');
            } else {
                toast.error("Cannot logout due to an error");
            }
        } catch (err) {
            toast.error("An error occurred during logout");
            console.error(err);
        }
    };

    return (
        <div className="container-fluid">
            <div className="container edit-container-user">
                <div className="img-container-user text-center">
                    {user.img && (
                        <img src={user.img} alt="User" className="img-fluid rounded-circle" />
                    )}
                </div>
                <div className="container text-center edit-text2">
                    <h1>
                        {user.username}
                        {user.isVerified && (
                            <i
                                className="bi bi-patch-check-fill text-primary ms-2"
                                title="Verified"
                            ></i>
                        )}
                    </h1>
                </div>

            </div>

            <div className="container min-vh-100">
                <hr />
                <h1 className="mt-5 mb-5">Add Articles</h1>
                <div className="container d-flex justify-content-center align-items-center">
                    <div className="card-user p-3 shadow-sm w-100" style={{ borderRadius: 12 }}>
                        <form name="postForm" onSubmit={handleSubmit}>
                            <div className="row g-4 mb-3">
                                <div className="d-flex align-items-center mb-2">
                                    {user.img && (
                                        <img
                                            src={user.img}
                                            alt="Profile"
                                            className="rounded-circle me-2"
                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                        />
                                    )}
                                    <h4 className="mt-1 edit-title2">Title:</h4>
                                    <textarea
                                        className="form-control border-0"
                                        placeholder="Enter title for this image"
                                        rows="1"
                                        style={{ resize: 'none' }}
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <textarea
                                    className="form-control border-0"
                                    placeholder="What would you like to talk about?"
                                    rows="10"
                                    style={{ resize: 'none' }}
                                    value={formData.desc}
                                    onChange={handleChange}
                                    name="desc"
                                    required
                                ></textarea>
                                <div className="d-flex flex-column mb-3">
                                    <div className="d-flex flex-row mb-3">
                                        <h4 className="px-3">Tags:</h4>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Type tag and press Enter or comma"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                        />
                                    </div>
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        {formData.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-primary">
                                                {tag}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white ms-2"
                                                    onClick={() => removeTag(index)}
                                                    style={{ fontSize: '0.6rem' }}
                                                ></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {
                                !selectedFile ? (<div
                                    ref={dropRef}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`p-4 mb-3 border rounded ${dragging ? 'bg-light border-primary' : 'bg-white'}`}
                                    style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderStyle: 'dashed' }}
                                    onClick={() => dropRef.current.querySelector('input[type="file"]').click()}
                                >
                                    <p className="mb-2">Drag & Drop an image here, or click to select a file</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                ) : (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Preview"
                                        className="img-fluid mb-3"
                                        style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover' }}
                                    />
                                )
                            }
                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary rounded-pill px-4">
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="container edit-login2 text-center mt-3 mb-4">
                    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </div>
            </div>
        </div>
    );
}
