'use client';
import React, { useState } from 'react'
import '@/styles/LoginPage.css';
import Link from 'next/link';

export default function LoginPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [isVisiblePassword2, setIsVisiblePassword2] = useState(false);
    const [isVisiblePassword3, setIsVisiblePassword3] = useState(false);

    const toggleForm = () => {
        return "";
    }

    return (
        <div>
            <div className="container-fluid d-flex justify-content-center align-items-center vh-80">
                <div className="edit-container2">
                    {/* Hidden checkbox to trigger flip */}
                    <input type="checkbox" id="flip" />

                    {/* The cover that will be flipped */}
                    <div className="cover">

                        {/* Front side of the container */}
                        <div className="front">
                            <img src="./img/login2.jpg" alt="" />
                        </div>

                        {/* Back side of the container */}
                        <div className="back">
                            <img className="backImg" src="./img/login1.jpg" alt="" />
                        </div>
                    </div>

                    {/* Login and Signup Forms */}
                    <form formcontrolname={showLogin ? 'loginForm' : 'signupForm'} onSubmit={() => submit()}>
                        <div className="form-content">
                            {/* Login Form  */}
                            <div className="login-form">
                                <div className="title">Sign in</div>
                                <div className="input-boxes">
                                    <div className="input-box">
                                        <i className="bi bi-envelope-at-fill"></i>
                                        <input type="text" formcontrolname="email" placeholder="Enter Your E-mail" />
                                    </div>
                                    <div className="input-box">
                                        <i className="bi bi-key-fill"></i>
                                        <input type={isVisiblePassword ? "password" : "text"} formcontrolname="password" placeholder="Enter Your Password" />
                                        <i
                                            className={`bi ${isVisiblePassword ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute`}
                                            style={{
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                                            title={isVisiblePassword ? "Hide Password" : "Show Password"}
                                        ></i>
                                    </div>
                                    <div className="text"><Link href="/resetpass">Forgot Password?</Link></div>
                                    <div className="button2 input-box">
                                        <input type="submit" value="Submit" />
                                    </div>
                                    <div className="text sign-up-text">Don&apos;t have an account? <label onClick={() => toggleForm()}
                                        htmlFor="flip">Create Account</label></div>
                                </div>
                            </div>

                            {/* Signup Form  */}
                            <div className="signup-form">
                                <div className="title">Sign up</div>
                                <div className="input-boxes">
                                    <div className="input-box">
                                        <i className="bi bi-person-fill"></i>
                                        <input type="text" formcontrolname="name" placeholder="Enter Your Name" />
                                    </div>
                                    <div className="input-box">
                                        <i className="bi bi-envelope-at-fill"></i>
                                        <input type="text" formcontrolname="email" placeholder="Enter Your E-mail" />
                                    </div>
                                    <div className="input-box">
                                        <i className="bi bi-key-fill"></i>
                                        <input type={isVisiblePassword2 ? "password" : "text"} formcontrolname="password" placeholder="Enter Your Password" />
                                        <i
                                            className={`bi ${isVisiblePassword2 ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute`}
                                            style={{
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => setIsVisiblePassword2(!isVisiblePassword2)}
                                        ></i>
                                    </div>
                                    <div className="input-box">
                                        <i className="bi bi-shield-lock-fill"></i>
                                        <input type={isVisiblePassword3 ? "password" : "text"} formcontrolname="confirmPassword" placeholder="Confirm Your Password" />
                                        <i
                                            className={`bi ${isVisiblePassword3 ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute`}
                                            style={{
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => setIsVisiblePassword3(!isVisiblePassword3)}
                                        ></i>
                                    </div>
                                    <div className="button2 input-box">
                                        <input type="submit" value="Submit" />
                                    </div>
                                    <div className="text sign-up-text">Already have an account? <label onClick={() => toggleForm()}
                                        htmlFor="flip">Login Now</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
