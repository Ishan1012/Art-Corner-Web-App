'use client';
import React, { useState } from 'react'
import '@/styles/LoginPage.css';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { login, signup } from '@/services/UserService';

export default function LoginPage() {
    const [showLogin, setShowLogin] = useState(true);
    const router = useRouter();
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [isVisiblePassword2, setIsVisiblePassword2] = useState(false);
    const [isVisiblePassword3, setIsVisiblePassword3] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!showLogin && (formData.name === '' || formData.email === '' || formData.password === '' || formData.confirmPassword === '')) {
            toast.error('Please fill all the details before submitting');
            return;
        }

        if (showLogin && (formData.email === '' || formData.password === '')) {
            toast.error('Please fill all the details before submitting');
            return;
        }

        try {
            let result;

            if (showLogin) {
                result = await login({
                    email: formData.email,
                    password: formData.password
                })

                if (!result || !result._id) {
                    toast.error("Login failed: "+result);
                    return;
                }

                toast.success(`Login successful \n You are signed in as ${result.username}`);
                router.push('/profile');
            }
            else {
                result = await signup({
                    username: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                })

                if (!result || !result._id) {
                    toast.error('Signup failed. Please try again.');
                    return;
                }

                toast.success(`Signup successful \n You are signed in as ${result.username}`);
                router.push('/profile');
            }
        } catch (err) {
            toast.error("An error occured " + err.message);
        }
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
                    <form name='resetForm' onSubmit={handleSubmit}>
                        <div className="form-content">
                            {/* Login Form  */}
                            <div className="login-form">
                                <div className="title">Sign in</div>
                                <div className="input-boxes">
                                    <div className="input-box">
                                        <i className="bi bi-envelope-at-fill"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter Your E-mail"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="bi bi-key-fill"></i>
                                        <input
                                            type={isVisiblePassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter Your Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <i
                                            className={`bi ${isVisiblePassword ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute`}
                                            style={{
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer"
                                            }}
                                            value={FormData.name}
                                            onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                                            title={isVisiblePassword ? "Hide Password" : "Show Password"}
                                        ></i>
                                    </div>
                                    <div className="text"><Link href="/resetpass">Forgot Password?</Link></div>
                                    <div className="button2 input-box">
                                        <input type="submit" value="Submit" />
                                    </div>
                                    <div className="text sign-up-text">Don&apos;t have an account? <label onClick={() => setShowLogin(false)}
                                        htmlFor="flip">Create Account</label></div>
                                </div>
                            </div>

                            {/* Signup Form  */}
                            <div className="signup-form">
                                <div className="title">Sign up</div>
                                <div className="input-boxes">
                                    <div className="input-box">
                                        <i className="bi bi-person-fill"></i>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="bi bi-envelope-at-fill"></i>
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="Enter Your E-mail"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="bi bi-key-fill"></i>
                                        <input
                                            type={isVisiblePassword2 ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter Your Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
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
                                        <input
                                            type={isVisiblePassword3 ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm Your Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
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
                                    <div className="text sign-up-text">Already have an account? <label onClick={() => setShowLogin(true)}
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
