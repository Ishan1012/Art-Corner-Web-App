import AboutPage from '@/components/feedback-about-us/AboutPage'
import { Header } from '@/components/Header'
import React from 'react'

export default function About() {
  return (
    <div>
        <Header open={5} />
        <div style={{marginTop: 60}}>
            <AboutPage />
        </div>
    </div>
  )
}
