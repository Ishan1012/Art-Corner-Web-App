'use client';
import React, { useState } from 'react'
import '@/styles/AboutPage.css';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function AboutPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const scrollToElement = (elementId) => {
        const element = document.getElementById(elementId);

        if (element) {
            element.scrollIntoView({
                behavior:
                    'smooth'
            });
        } else {
            console.error(`Element with ID "${elementId}" not found.`);
        }
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.name === '' || formData.email === '' || formData.subject === '' || formData.message === '') {
            toast.error('Please fill all the details before submitting');
            return;
        }
        toast.success('Form submitted');
        router.push('/');
    }

    return (
        <div>
            <div id="header">
                <div className="contact">
                    <h6 className="rotate">About Us</h6>
                    <h1>We have <br />Refined <br />Minimalism</h1>
                    <p>
                        With its clean design and essence-centered aesthetic, the interface offers a streamlined, elegant simplicity that prioritizes function over ornamentation.
                    </p>
                    <div onClick={() => scrollToElement('contact')}><a>Let&apos;s talk</a></div>
                </div>
                <div className="image">
                    <img src="./img/cover2-rmbg.png" alt="" />
                </div>
            </div>
            <div id="about">
                <h6 className="rotate">Services</h6>
                <h2>Services We Provide</h2>
                <div className="services">
                    <Link className="service" href="/" style={{ textDecoration: 'none', color: '#000' }}>
                        <h2>01</h2>
                        <h3>Art Gallery</h3>
                        <p>
                            Explore a diverse collection of stunning artworks, curated to inspire and captivate every viewer.
                            Our gallery offers a unique window into various artistic expressions, each piece telling its own
                            story through vivid imagery and creativity.
                        </p>
                    </Link>
                    <Link className="service" href="/explore" style={{ textDecoration: 'none', color: '#000' }}>
                        <h2>02</h2>
                        <h3>Educational Resources</h3>
                        <p>
                            Access concise, informative contact about each topic, accompanied by visually engaging images to
                            enhance your learning experience. Easily download images to keep valuable educational resources at
                            your fingertips for reference anytime.
                        </p>
                    </Link>
                    <Link className="service" href="/bookmarks" style={{ textDecoration: 'none', color: '#000' }}>
                        <h2>03</h2>
                        <h3>Accessibility Features</h3>
                        <p>
                            Enjoy personalized accessibility with features that allow you to bookmark and like artifacts, join
                            communities, and connect with other art enthusiasts. Create your own profile page to share contact,
                            showcase your work, and engage with others in the art world.
                        </p>
                    </Link>
                    <Link className="service" href="/profile" style={{ textDecoration: 'none', color: '#000' }}>
                        <h2>04</h2>
                        <h3>Artists Profiles</h3>
                        <p>
                            Artists can create their profiles to showcase their unique work, connecting with a community that
                            values their creativity. Post your artifacts, gain followers, and share your artistic journey with
                            others on our platform.
                        </p>
                    </Link>
                    <Link className="service" href="/community" style={{ textDecoration: 'none', color: '#000' }}>
                        <h2>05</h2>
                        <h3>Community Forum</h3>
                        <p>
                            Discover a variety of community channels tailored to different interests, each with a brief
                            description to help you find the right fit. Join channels at your convenience to connect, share
                            ideas, and engage with others who share your passion.
                        </p>
                    </Link>
                    <Link className="service" href="/news" style={{ textDecoration: 'none', color: '#000' }}>
                        <h2>06</h2>
                        <h3>News Section</h3>
                        <p>
                            Stay updated with the latest news and announcements through real-time notifications on your bell
                            icon. Click to read detailed descriptions and never miss important updates in your feed.
                        </p>
                    </Link>

                </div>
            </div>
            <div id="contact">
                <h3 className="rotate">Contact</h3>
                <h2>Let&apos;s Discuss Project</h2>
                <div className="contact-details">
                    <form name="postForm" onSubmit={handleSubmit}>
                        <h3>Get in touch</h3>
                        <h6>Our friendly team would love to hear from you</h6>
                        <div className="name-email">
                            <div className="name-box">
                                <label htmlFor="#">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                />
                            </div>
                            <div className="Email-box">
                                <label htmlFor="#">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                        <div className="subject">
                            <label htmlFor="#">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                            />
                        </div>
                        <div className="Message">
                            <label htmlFor="#">Message</label>
                            <textarea
                                name="message"
                                cols="30"
                                rows="5"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <button className="send-edit"><a className="text-decoration-none fw-bold">Send message</a></button>
                    </form>
                    <div className="details">
                        <div className="detail-box">
                            <div className="icon">
                                <i className="fa fa-envelope"></i>
                            </div>
                            <div className="box">
                                <h5>Email</h5>
                                <h4>2k23.cs2312241&#64;gmail.com</h4>
                            </div>
                        </div>
                        <div className="detail-box">
                            <div className="icon">
                                <i className="fa fa-location"></i>
                            </div>
                            <div className="box">
                                <h5>Visit our github page:</h5>
                                <h4><Link target='_blank' href="https://github.com/Ishan1012/Art-Corner-Web-App">https://github.com/Ishan1012/Art-Corner-Web-App</Link></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
