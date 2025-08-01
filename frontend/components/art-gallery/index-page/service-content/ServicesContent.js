'use client';
import React from 'react'
import Link from 'next/link';
import '@/styles/ServicesContent.css'

export default function ServicesContent() {
    return (
        <section className="sc-services">
            <div className="services-shape">
                <img src="./icon/curve-shape-1.png" alt=""/>
            </div>
            <div className="container">
                <div className="services-content">
                    <div className="title-box text-center">
                        <div className="content-wrapper">
                            <h1 className="title-box-name">Featured Categories</h1>
                            <br/>
                                <p className="text title-box-text">Organize your art collection into distinct categories for easy
                                    exploration. Each category offers a curated selection of diverse styles, mediums, and
                                    themes, ensuring a personalized experience for every user.</p>
                        </div>
                    </div>

                    <div className="services-list">
                        <div className="services-item">
                            <div className="item-icon d-flex justify-content-center align-items-center">
                                <img src="./icon/paintings.png" alt="service icon"/>
                            </div>
                            <h5 className="item-title fw-7">Paintings</h5>
                            <p className="text">Explore a vibrant collection of artworks ranging from traditional oil and
                                watercolor to modern acrylic masterpieces. Dive into themes like portraits, landscapes, and
                                abstract expressions.
                            </p>
                        </div>

                        <div className="services-item">
                            <div className="item-icon d-flex justify-content-center align-items-center">
                                <img src="./icon/digital-art.png" alt="service icon"/>
                            </div>
                            <h5 className="item-title fw-7">Digital Art</h5>
                            <p className="text">Discover cutting-edge creations that merge technology with artistry, featuring
                                stunning illustrations, 3D designs, and pixel art. A realm where imagination meets
                                innovation.</p>
                        </div>

                        <div className="services-item">
                            <div className="item-icon d-flex justify-content-center align-items-center">
                                <img src="./icon/camera.png" alt="service icon"/>
                            </div>
                            <h5 className="item-title fw-7">Photography</h5>
                            <p className="text">Capture the world through the lens with breathtaking shots of nature, urban
                                landscapes, portraits, and more. Each photo tells a story, freezing moments in time.</p>
                        </div>

                        <div className="services-item">
                            <div className="item-icon d-flex justify-content-center align-items-center">
                                <img src="./icon/sculptures.png" alt="service icon"/>
                            </div>
                            <h5 className="item-title fw-7">Sculptures</h5>
                            <p className="text">Admire the beauty of three-dimensional art crafted from stone, metal, clay, and
                                beyond. From classical statues to modern installations, feel the art in its tangible form.
                            </p>
                        </div>

                        <div className="services-item">
                            <div className="item-icon d-flex justify-content-center align-items-center">
                                <img src="./icon/camera-focus.png" alt="service icon"/>
                            </div>
                            <h5 className="item-title fw-7">Interactive Hover Effects</h5>
                            <p className="text">Bring categories to life with subtle animations like zoom-ins or color overlays,
                                creating a visually dynamic experience. On hover, display brief descriptions or highlights
                                to engage users further.</p>
                        </div>

                        <div className="services-item">
                            <div className="item-icon d-flex justify-content-center align-items-center">
                                <img src="./icon/design-tool.png" alt="service icon"/>
                            </div>
                            <h5 className="item-title fw-7">Dynamic Category Highlights</h5>
                            <p className="text">Feature a standout artwork or artist for each category with a thumbnail and
                                their name. This draws attention to top creations and adds depth to the browsing experience.
                            </p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center services-main-btn">
                        <Link className="btn btn-outline-warning" href="/explore">Learn more</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
