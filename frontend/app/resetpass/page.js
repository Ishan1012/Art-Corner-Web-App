import ResetPasswordPage from '@/components/artists-profiles/forgot-password/ResetPasswordPage'
import { Header } from '@/components/Header'
import React from 'react'

export default function ResetPassword() {
  return (
    <div>
        <Header />
        <div style={{marginTop: 60}}>
            <ResetPasswordPage />
        </div>
    </div>
  )
}
