import GenerateImageDashboard from '@/components/educational-resources/generate-image-dashboard/GenerateImageDashboard'
import { Header } from '@/components/Header'
import React from 'react'

export default function Generate() {
    return (
        <div>
            <Header open={3} />
            <div style={{ marginTop: 60 }}>
                <GenerateImageDashboard />
            </div>
        </div>
    )
}
