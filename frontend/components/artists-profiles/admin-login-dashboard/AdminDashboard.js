'use client';
import React, { useEffect, useRef, useState } from 'react';
import { getUser, logout, getAllUsers } from '@/services/UserService';
import getAll from '@/services/CommunityService';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import { toast } from 'react-toastify';
import '@/styles/UserDashboard.css';
import { useRouter } from 'next/navigation';
import UploadImageService from '@/services/UploadImageService';

export default function AdminDashboard({ user: initialUser }) {
    const [user, setUser] = useState(initialUser || null);
    const router = useRouter();
    const [loading, setLoading] = useState(!initialUser);
    const [activeTab, setActiveTab] = useState('post'); // 'post' | 'users' | 'communities'
    
    // Stats & Management Data
    const [usersList, setUsersList] = useState([]);
    const [communitiesList, setCommunitiesList] = useState([]);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    // Form & Upload State
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
        const loadDashboardData = async () => {
            const currentUser = user || getUser();

            if (currentUser && (currentUser._id || currentUser.id)) {
                setUser(currentUser);
            } else {
                toast.error('User not found or invalid credentials.');
                router.push('/');
                return;
            }

            try {
                const [allUsers, allComms] = await Promise.all([
                    getAllUsers(),
                    getAll()
                ]);
                setUsersList(allUsers || []);
                setCommunitiesList(allComms || []);
            } catch (err) {
                console.error('Error fetching admin dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    if (!user) {
        return null;
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

                    if (response !== undefined) {
                        toast.success('Admin Article uploaded successfully!');
                        setFormData({ title: '', desc: '', tags: [] });
                        setSelectedFile(null);
                        router.push('/explore');
                    } else {
                        toast.error('An error occurred during upload.');
                    }
                } catch (error) {
                    toast.error('Failed to upload image.');
                    console.error('Upload error:', error);
                }
            };

            reader.readAsDataURL(selectedFile);
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
                setUser(null);
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

    const filteredUsers = usersList.filter(u => 
        (u.username || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    return (
        <div className="container-fluid py-4">
            {/* Admin Profile Header */}
            <div className="container edit-container-user text-center">
                <div className="img-container-user text-center position-relative d-inline-block">
                    <img 
                        src={user.img || '/profiles/profile1.png'} 
                        alt="Admin Avatar" 
                        className="img-fluid rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <span 
                        className="position-absolute bottom-0 end-0 badge rounded-pill bg-danger fs-6 p-2"
                        title="Administrator Privilege"
                    >
                        <i className="bi bi-shield-lock-fill me-1"></i> Admin
                    </span>
                </div>
                <div className="container text-center edit-text2 mt-3">
                    <h1 className="fw-bold">
                        {user.username}
                        <i
                            className="bi bi-patch-check-fill text-warning ms-2"
                            title="Verified Administrator"
                        ></i>
                    </h1>
                    <p className="text-muted fs-6">{user.email}</p>
                </div>
            </div>

            {/* Quick Overview Metrics */}
            <div className="container my-4">
                <div className="row g-3 justify-content-center text-center">
                    <div className="col-md-4">
                        <div className="p-3 bg-white rounded shadow-sm border border-warning border-2">
                            <i className="bi bi-people-fill fs-2 text-warning"></i>
                            <h4 className="fw-bold mt-2">{usersList.length}</h4>
                            <p className="text-muted mb-0">Total Registered Users</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 bg-white rounded shadow-sm border border-primary border-2">
                            <i className="bi bi-collection-fill fs-2 text-primary"></i>
                            <h4 className="fw-bold mt-2">{communitiesList.length}</h4>
                            <p className="text-muted mb-0">Active Communities</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 bg-white rounded shadow-sm border border-success border-2">
                            <i className="bi bi-shield-check fs-2 text-success"></i>
                            <h4 className="fw-bold mt-2">Administrator</h4>
                            <p className="text-muted mb-0">Full Access Granted</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Management Tabs */}
            <div className="container mt-4 min-vh-100">
                <ul className="nav nav-tabs justify-content-center mb-4 border-bottom border-2">
                    <li className="nav-item">
                        <button 
                            className={`nav-link fw-bold ${activeTab === 'post' ? 'active text-primary' : 'text-dark'}`}
                            onClick={() => setActiveTab('post')}
                        >
                            <i className="bi bi-plus-circle-fill me-2"></i>Add Admin Article
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link fw-bold ${activeTab === 'users' ? 'active text-primary' : 'text-dark'}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <i className="bi bi-people-fill me-2"></i>Registered Users ({usersList.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link fw-bold ${activeTab === 'communities' ? 'active text-primary' : 'text-dark'}`}
                            onClick={() => setActiveTab('communities')}
                        >
                            <i className="bi bi-diagram-3-fill me-2"></i>Communities ({communitiesList.length})
                        </button>
                    </li>
                </ul>

                {/* TAB 1: ADD ARTICLES / POSTS */}
                {activeTab === 'post' && (
                    <div className="container d-flex justify-content-center align-items-center">
                        <div className="card-user p-4 shadow-sm w-100 bg-white" style={{ borderRadius: 12 }}>
                            <h3 className="mb-4 text-center fw-bold text-dark">Publish Admin Article / Artwork</h3>
                            <form name="postForm" onSubmit={handleSubmit}>
                                <div className="row g-4 mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <img
                                            src={user.img || '/profiles/profile1.png'}
                                            alt="Profile"
                                            className="rounded-circle me-2"
                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                        />
                                        <h4 className="mt-1 edit-title2">Title:</h4>
                                        <textarea
                                            className="form-control border"
                                            placeholder="Enter title for this article"
                                            rows="1"
                                            style={{ resize: 'none' }}
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <textarea
                                        className="form-control border p-3"
                                        placeholder="What would you like to publish as Admin?"
                                        rows="8"
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
                                                <span key={index} className="badge bg-primary fs-6 p-2">
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

                                {!selectedFile ? (
                                    <div
                                        ref={dropRef}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`p-4 mb-3 border rounded ${dragging ? 'bg-light border-primary' : 'bg-white'}`}
                                        style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderStyle: 'dashed' }}
                                        onClick={() => dropRef.current.querySelector('input[type="file"]').click()}
                                    >
                                        <p className="mb-2 text-center text-muted">Drag & Drop an image here, or click to select a file</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center mb-3">
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Preview"
                                            className="img-fluid rounded border shadow-sm"
                                            style={{ maxWidth: 250, maxHeight: 250, objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-bold">
                                        Publish Article
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* TAB 2: REGISTERED USERS */}
                {activeTab === 'users' && (
                    <div className="container bg-white p-4 shadow-sm rounded border">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="fw-bold mb-0">Registered Platform Users</h3>
                            <div className="w-50">
                                <input 
                                    type="text" 
                                    className="form-control"
                                    placeholder="Search users by name or email..."
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle border">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((u, index) => (
                                            <tr key={u._id || u.id || index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img 
                                                            src={u.img || '/profiles/profile1.png'} 
                                                            alt={u.username}
                                                            className="rounded-circle me-2"
                                                            style={{ width: 35, height: 35, objectFit: 'cover' }}
                                                        />
                                                        <span className="fw-semibold">{u.username}</span>
                                                    </div>
                                                </td>
                                                <td>{u.email}</td>
                                                <td>
                                                    {u.isAdmin ? (
                                                        <span className="badge bg-danger">Admin</span>
                                                    ) : (
                                                        <span className="badge bg-secondary">User</span>
                                                    )}
                                                </td>
                                                <td className="small text-muted">{u._id || u.id}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: COMMUNITIES OVERVIEW */}
                {activeTab === 'communities' && (
                    <div className="container bg-white p-4 shadow-sm rounded border">
                        <h3 className="fw-bold mb-4">Platform Communities Overview</h3>
                        <div className="row g-4">
                            {communitiesList.length > 0 ? (
                                communitiesList.map((comm, idx) => (
                                    <div key={comm._id || comm.id || idx} className="col-md-6 col-lg-4">
                                        <div className="card h-100 shadow-sm border">
                                            <div className="card-body text-center">
                                                <img 
                                                    src={comm.img || '/profiles/profile1.png'} 
                                                    alt={comm.name}
                                                    className="rounded-circle mb-3 border"
                                                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                                                />
                                                <h5 className="card-title fw-bold">{comm.name}</h5>
                                                <p className="card-text text-muted small">
                                                    {(comm.description || '').substring(0, 100)}...
                                                </p>
                                                <span className="badge bg-info text-dark">
                                                    {comm.members?.length || 0} Members
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center py-4">No communities available.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Logout Action */}
                <div className="container edit-login2 text-center my-5">
                    <button onClick={handleLogout} className="btn btn-danger px-4 py-2 fw-bold">
                        <i className="bi bi-box-arrow-right me-2"></i>Logout Admin
                    </button>
                </div>
            </div>
        </div>
    );
}
