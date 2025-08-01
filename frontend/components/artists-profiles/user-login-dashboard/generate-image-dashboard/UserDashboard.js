'use client';
import React, { useEffect, useRef, useState } from 'react';
import AdminDashboard from '../../admin-login-dashboard/AdminDashboard';
import { getUser } from '@/services/UserService';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import { toast } from 'react-toastify';
import '@/styles/UserDashboard.css';

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const dropRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const data = getUser({
            _id: "673ae6ef03ba261cdd7171a8",
            password: "$2a$10$4DtvL.lOl46xCtsbJwV4lOthalYkLex6r.zRFSMg2kjoMSOdv/LrK"
        });

        if (data) {
            setUser(data);
        } else {
            toast.error('User not found or invalid credentials.');
        }
    }, []);

    if (!user) {
        return <LoadingPage />;
    }

    if (user.isAdmin) {
        return <AdminDashboard />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Form submitted");
        // Add your form processing logic here
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

    const logout = () => {
        // Add your logout logic here
        toast.info("Logged out");
        // You might want to clear state or redirect
    };

    return (
        <div className="container-fluid">
            <div className="container edit-container-user">
                <div className="img-container-user text-center">
                    {user.img && (
                        <img src={`/${user.img}`} alt="User" className="img-fluid rounded-circle" />
                    )}
                </div>
                <div className="container text-center edit-text2">
                    <h1>{user.name}</h1>
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
                                            src={`/${user.img}`}
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
                                        required
                                    ></textarea>
                                </div>
                                <textarea
                                    className="form-control border-0"
                                    placeholder="What would you like to talk about?"
                                    rows="10"
                                    style={{ resize: 'none' }}
                                    name="desc"
                                    required
                                ></textarea>
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

                <div className="container edit-login2 text-center mt-5">
                    <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>
            </div>
        </div>
    );
}
