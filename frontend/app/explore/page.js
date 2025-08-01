import ExplorePage from '@/components/art-gallery/explore-components/ExplorePage'
import { Header } from '@/components/Header'
import React from 'react'

export default function Explore() {
  return (
    <div>
        <Header open={2} />
        <div style={{marginTop: 60}}>
            <ExplorePage />
        </div>
    </div>
  )
}
