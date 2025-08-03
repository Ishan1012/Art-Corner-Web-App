'use client';
import React, { useEffect, useState } from 'react';
import '@/styles/Header.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/services/UserService';
import { toast } from 'react-toastify';

export function Header({ open, setOpen }) {
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const links = [
        { href: '/', label: 'Home', id: 1 },
        { href: '/explore', label: 'Explore', id: 2 },
        { href: '/generate', label: 'Generate', id: 3 },
        { href: '/bookmarks', label: 'Bookmarks', id: 4 },
        { href: '/community', label: 'Community', id: 5 },
        { href: '/about', label: 'About', id: 6 },
    ];
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUser();

            if (data && data._id) {
                setUser(data);
            }
        };

        fetchUser();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() !== '') {
            router.push(`/search/${search}`);
        }
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

    const openProfile = () => {
        router.push('/profile');
    }

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <nav className="navbar fixed-top bg-color navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    <img src="/icon/logo-navbar2.png" alt="Logo" className="img-navbar-edit" />
                </Link>

                {/* Mobile hamburger toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible menu */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {
                            links.map(link => (
                                <li className="nav-item me-2" key={link.id}>
                                    <Link
                                        className={`nav-link btn btn-outline-warning ${open === link.id ? 'active' : ''}`}
                                        href={link.href}
                                        onClick={() => {
                                            setOpen(link.id);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                    </ul>

                    {/* Notification icon */}
                    <div className="navbar-brand edit-icon">
                        <Link href="/news">
                            <i className="bi bi-bell-fill"></i>
                        </Link>
                    </div>

                    {/* Search bar */}
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

                    {/* Profile / Login */}
                    <div className="navbar-brand edit-profile text-center">
                        {!user ? (
                            <Link href="/login">
                                <i className="bi bi-person-circle fs-3 text-secondary"></i>
                            </Link>
                        ) : (
                            <div className="dropdown profile-dropdown">
                                <div
                                    type="button"
                                    className="profile-button"
                                >
                                    <img src={user.img} alt="Profile" className="edit-profile-img" />
                                </div>
                                <ul className="dropdown-menu show">
                                    <li><button onClick={openProfile} className="dropdown-item">Profile</button></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
