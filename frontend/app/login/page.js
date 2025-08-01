import LoginPage from '@/components/artists-profiles/login-signup-form/LoginPage'
import { Header } from '@/components/Header'
import React from 'react'

export default function Login() {
  return (
    <div>
        <Header />
        <div style={{marginTop: 60}}>
            <LoginPage />
        </div>
    </div>
  )
}
