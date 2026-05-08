'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { SceneLoader } from '@/components/shared/SceneLoader'
import { ET } from '@/lib/theme'
import LaunchpadOverlay from '@/components/LaunchpadOverlay'

const OSLaunchpadScene = dynamic(() => import('@/components/OSLaunchpadScene'), {
  ssr: false,
  loading: () => <SceneLoader />
})

export default function OSPage() {
  const [allowed, setAllowed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setAllowed(process.env.NODE_ENV === 'development')
    setChecked(true)
  }, [])

  if (!checked) return null

  if (!allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: ET.bg, color: ET.ink }}>
        <p className="text-sm opacity-60">This page is only available in local development.</p>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: ET.bg }}>
      <div className="absolute inset-0 z-0">
        <OSLaunchpadScene />
      </div>
      <LaunchpadOverlay />
    </main>
  )
}
