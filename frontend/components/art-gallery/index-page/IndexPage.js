'use client';
import React, { use, useState } from 'react'
import Link from 'next/link';
import '@/styles/IndexPage.css';
import GridOne from './grid-one-content/GridOne';
import ServicesContent from './service-content/ServicesContent';
import { useRouter } from 'next/navigation';

export default function IndexPage() {
    const [user, serUser] = useState(null);
    const router = useRouter();

    const redirect = () => {
        if(!user) {
            router.push('/login');
        }
        else {
            router.push('/profile');
        }
    }

    return (
        <div className="container-fluid edit-container-index" style={{padding: 0}}>
            <div className="hero" id="hero-arena">
                <div className="content">
                    <h3>Welcome to</h3>
                    <h1>Art <br /> <span>Corner</span></h1>
                    <p>A <strong>Responsive Portfolio</strong> Web Application</p>

                    <div className="contact-section">
                        {
                            !user ?
                                <button className="btncontact" onClick={redirect}>Sign In</button>
                                :
                                <button className="btncontact" onClick={redirect}>Explore</button>
                        }
                        <div className="social-icons mb-2">
                            <Link href="https://github.com/Ishan1012/The-Art-Corner-Web-Application/tree/main" target="_blank"><i
                                className="bi bi-github"></i></Link>
                            <Link href="https://www.instagram.com/" target="_blank"><i className="bi bi-instagram"></i></Link>
                            <Link href="https://twitter.com/?lang=en" target="_blank"><i className="bi bi-twitter-x"></i></Link>
                            <Link href="https://www.linkedin.com/posts/ishan-dwivedi-8146712b9_angular-artcorner-webdevelopment-activity-7263636377823494146-SSjG?utm_source=share&utm_medium=member_desktop" target="_blank"><i
                                className="bi bi-linkedin"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="hero-image" data-tilt data-perspective="1000" data-tilt-max="11">
                    <img src="/img/cover-rmbg.png" className="w-100" alt="Place a image here" style={{width: 430}} />
                </div>
            </div>

            <ServicesContent />

            <GridOne />

            <section className="sc-grid sc-grid-two">
                <div className="container">
                    <div className="grid-content d-grid align-items-center">
                        <div className="grid-img">
                            <img src="./icon/grid-one.png" alt=""/>
                        </div>
                        <div className="grid-text">
                            <div className="content-wrapper text-start btn-container">
                                <div className="title-box">
                                    <h3 className="title-box-name">Highlight Masterpieces in Every Category</h3>
                                    <br/>
                                </div>
                                <p className="text title-box-text">Celebrate the best of each category by featuring a "Top Pick" or
                                    "Featured Artwork" that stands out. Display a thumbnail of the artwork alongside the
                                    artist's name to give credit and inspire curiosity. This not only draws attention to
                                    exceptional talent but also adds a personal touch to the browsing experience. Such
                                    highlights encourage visitors to explore deeper and appreciate the diversity within each art
                                    form.</p>
                                <Link href="/community" type="button" className="btn btn-outline-warning">Learn more</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
