'use client'

import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars, Environment } from '@react-three/drei'
import { useSystem } from '@/lib/system-context'
import { ET } from '@/lib/theme'
import ToolNode from './ToolNode'
import ShieldWeb from './ShieldWeb'
import RoadmapNode from './RoadmapNode'
import RoadmapWeb from './RoadmapWeb'

const tools = [
  {
    title: 'Emergency Recovery',
    description: 'A 5-step fail-safe for when burnout spirals begin. Run the reset protocol in under 10 minutes.',
    href: '/momentum',
    color: '#ff4444',
    type: 'sphere' as const,
    complexity: 'low',
    position: [-8, 0, -2] as [number, number, number]
  },
  {
    title: 'Protocol Builder',
    description: 'Architect your momentum constellation. Map tasks in 3D space to bypass emotional resistance.',
    href: '/protocol-builder',
    color: ET.accent,
    type: 'octahedron' as const,
    complexity: 'high',
    position: [-3, 5, -4] as [number, number, number]
  },
  {
    title: 'The Atomizer',
    description: 'Break intimidating projects into 2-minute atomic steps with AI.',
    href: '/atomizer',
    color: '#a78bfa',
    type: 'tetrahedron' as const,
    complexity: 'high',
    position: [8, 2, -3] as [number, number, number]
  },
  {
    title: 'Ignite Momentum',
    description: '600-second power-up sequence to break inertia and launch into flow state.',
    href: '/ignition',
    color: '#f43f5e',
    type: 'dodecahedron' as const,
    complexity: 'medium',
    position: [6, -4, -2] as [number, number, number]
  }
]

export default function OSLaunchpadScene() {
  const { isLocked, isProtected } = useSystem()
  const [isRoadmapExpanded, setIsRoadmapExpanded] = useState(false)

  return (
    <div className="w-full h-full bg-zinc-950">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, isRoadmapExpanded ? 15 : 10]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={20}
          autoRotate={isLocked && !isRoadmapExpanded}
          autoRotateSpeed={0.5}
        />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />

        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Geodesic Shield Layer */}
          <ShieldWeb />

          {/* Core Tool Constellation - hidden when locked */}
          {!isRoadmapExpanded && !isLocked && (
            <group>
              {tools.map((tool, i) => (
                <ToolNode
                  key={i}
                  {...tool}
                  isDisabled={isProtected && tool.complexity === 'high'}
                />
              ))}
            </group>
          )}

          {/* Roadmap / Blueprint Layer (Admin/Dev only) */}
          {process.env.NODE_ENV === 'development' && (
            <>
              <RoadmapNode 
                position={[0, 0, 5]} 
                isExpanded={isRoadmapExpanded}
                onToggle={() => setIsRoadmapExpanded(!isRoadmapExpanded)}
              />
              {isRoadmapExpanded && <RoadmapWeb isVisible={isRoadmapExpanded} />}
            </>
          )}

          {/* Environment for reflections */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}
