import UserDashboard from '@/components/artists-profiles/user-login-dashboard/UserDashboard'
import { Header } from '@/components/Header'
import React from 'react'

export default function Profile() {
    return (
        <div>
            <Header />
            <div style={{ marginTop: 60 }}>
                <UserDashboard />
            </div>
        </div>
    )
}
