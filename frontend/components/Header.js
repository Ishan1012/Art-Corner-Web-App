'use client';
import React, { useState } from 'react';
import '@/styles/Header.css';
import Link from 'next/link';
import { searchArtifacts, setArtifacts } from '@/services/ArtifactsService';
import { useRouter } from 'next/navigation';

export function Header({ open }) {
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();

        if(search !== '') {
            router.push(`/search/${search}`);
        }
    };

    const logout = (e) => {
        e.preventDefault();
        // Implement your logout logic here
    };

    return (
        <nav className="navbar fixed-top bg-color navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    <img src="/icon/logo-navbar2.png" alt="" className="img-navbar-edit" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item me-2">
                            <Link className={`nav-link btn btn-outline-warning ${open === 1 ? 'active':''}`} href="/" onClick={() => setOpen(1)}>Home</Link>
                        </li>
                        <li className="nav-item me-2">
                            <Link className={`nav-link btn btn-outline-warning ${open === 2 ? 'active':''}`} href="/explore" onClick={() => setOpen(2)}>Explore</Link>
                        </li>
                        <li className="nav-item me-2">
                            <Link className={`nav-link btn btn-outline-warning ${open === 3 ? 'active':''}`} href="/bookmarks" onClick={() => setOpen(3)}>Bookmarks</Link>
                        </li>
                        <li className="nav-item me-2">
                            <Link className={`nav-link btn btn-outline-warning ${open === 4 ? 'active':''}`} href="/community" onClick={() => setOpen(4)}>Community</Link>
                        </li>
                        <li className="nav-item me-2">
                            <Link className={`nav-link btn btn-outline-warning ${open === 5 ? 'active':''}`} href="/about" onClick={() => setOpen(5)}>About</Link>
                        </li>
                    </ul>
                    <div className="navbar-brand edit-icon">
                        <Link href="/news">
                            <i className="bi bi-bell-fill"></i>
                        </Link>
                    </div>
                    <form className="d-flex" role="search" onSubmit={handleSearch}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    <div className="navbar-brand edit-profile text-center">
                        {!user ? (
                            <Link href="/login">
                                <i className="bi bi-person-circle fs-3 text-secondary"></i>
                            </Link>
                        ) : (
                            <div className="dropdown profile-dropdown">
                                <button
                                    type="button"
                                    aria-expanded={open}
                                    onClick={() => setOpen(!open)}
                                    className="profile-button"
                                >
                                    <img src={user.img} alt="Profile" className="edit-profile-img" />
                                </button>
                                {open && (
                                    <ul className="dropdown-menu show">
                                        <li>
                                            <Link className="dropdown-item" href="/profile">Profile</Link>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={logout}>Logout</button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
