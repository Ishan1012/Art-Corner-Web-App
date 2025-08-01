'use client';
import React, { useState } from 'react'
import '@/styles/LoginPage.css';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [resetForm, setResetForm] = useState(false);
    const router = useRouter();

    const submit = () => {
        router.push('/');
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
                            <img src="./img/login4.png" alt="" />
                        </div>

                        {/* Back side of the container */}
                        <div className="back">
                            <img className="backImg" src="./img/login1.jpg" alt="" />
                        </div>
                    </div>

                    {/* Login and Signup Forms */}
                    <form formcontrolname='resetForm' onSubmit={() => submit()} style={{height: 400}}>
                        <div className="form-content">
                            {/* Login Form  */}
                            <div className="login-form">
                                <div className="title">Reset Password</div>
                                <div className="input-boxes">
                                    <div className="input-box">
                                        <i className="bi bi-envelope-at-fill"></i>
                                        <input type="text" formcontrolname="email" placeholder="Enter Your E-mail" />
                                    </div>
                                    <div className="button2 input-box">
                                        <input type="submit" value="Submit" />
                                    </div>
                                </div>
                            </div>

                            {/* Signup Form  */}
                            <div className="signup-form">
                                <div className="title">Sign up</div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
