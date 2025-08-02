'use client';
import React, { useState } from 'react';
import '@/styles/Header.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() !== '') {
            router.push(`/search/${search}`);
        }
    };

    const logout = (e) => {
        e.preventDefault();
        // Implement logout logic
    };

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
                                <button
                                    type="button"
                                    className="profile-button"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    <img src={user.img} alt="Profile" className="edit-profile-img" />
                                </button>
                                {isMenuOpen && (
                                    <ul className="dropdown-menu show">
                                        <li><Link className="dropdown-item" href="/profile">Profile</Link></li>
                                        <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
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
