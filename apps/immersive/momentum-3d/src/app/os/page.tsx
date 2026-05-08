'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { SceneLoader } from '@/components/shared/SceneLoader'
import { ET } from '@/lib/theme'
import LaunchpadOverlay from '@/components/LaunchpadOverlay'

// Dynamically import the 3D scene with no SSR and a loading state
const OSLaunchpadScene = dynamic(() => import('@/components/OSLaunchpadScene'), {
  ssr: false,
  loading: () => <SceneLoader />
})

export default function OSPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: ET.bg }}>
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <OSLaunchpadScene />
      </div>

      {/* UI Overlay Layer */}
      <LaunchpadOverlay />
    </main>
  )
}
