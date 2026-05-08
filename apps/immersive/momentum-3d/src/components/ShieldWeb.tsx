'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSystem } from '@/lib/system-context'
import { Droplets, Eye, Headphones, Check } from 'lucide-react'
import { ET } from '@/lib/theme'

// Singleton audio element shared across all bio nodes — avoids 3× duplicate
// allocations and leaks per shield mount (#55).
let _bioAudio: HTMLAudioElement | null = null
function playBioSound() {
  if (typeof window === 'undefined') return
  if (!_bioAudio) {
    _bioAudio = new Audio('/audio/spark-phase.mp3')
    _bioAudio.volume = 0.4
  }
  _bioAudio.currentTime = 0
  _bioAudio.play().catch(() => {})
}

interface BioNodeProps {
  position: [number, number, number]
  label: string
  icon: React.ElementType
  active: boolean
  onClick: () => void
}

function BioNode({ position, label, icon: Icon, active, onClick }: BioNodeProps) {
  const [hovered, setHovered] = React.useState(false)

  const handleNodeClick = () => {
    if (!active) {
      playBioSound()
      onClick()
    }
  }

  return (
    <group position={position}>
      <mesh 
        onClick={(e) => {
          e.stopPropagation()
          handleNodeClick()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={active ? ET.accent : '#ff4444'} 
          emissive={active ? ET.accent : '#ff4444'}
          emissiveIntensity={hovered ? 2 : 0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <Html distanceFactor={10} position={[0, 0.6, 0]} center>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          borderRadius: '9999px',
          border: '1px solid',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s',
          backgroundColor: active ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 68, 68, 0.1)',
          borderColor: active ? 'rgba(0, 255, 255, 0.25)' : 'rgba(255, 68, 68, 0.25)',
          color: active ? '#00E5FF' : '#FF4444',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          boxShadow: hovered ? '0 0 15px rgba(0, 229, 255, 0.3)' : 'none',
          cursor: 'pointer',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {label === 'Hydration' && <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />}
            {label === 'Lighting' && <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </>}
            {label === 'Acoustics' && <>
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </>}
          </svg>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            {active ? label + ' OK' : label}
          </span>
          {active && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </Html>
    </group>
  )
}

export default function ShieldWeb() {
  const { sensory, setSensory, isLocked } = useSystem()
  const meshRef = useRef<THREE.Mesh>(null)

  // Vertex positions for the biological nodes
  // We'll pick 3 distinct vertices on a radius of 4
  const bioNodes = [
    { key: 'water', label: 'Hydration', icon: Droplets, pos: [4, 0, 0] as [number, number, number] },
    { key: 'light', label: 'Lighting', icon: Eye, pos: [-2, 3.5, 0] as [number, number, number] },
    { key: 'noise', label: 'Acoustics', icon: Headphones, pos: [-2, -3.5, 0] as [number, number, number] },
  ]

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      meshRef.current.rotation.x += 0.001
      
      // Retraction animation
      const targetScale = isLocked ? 1 : 0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05)
    }
  })

  return (
    <group>
      {/* The Geodesic Shield */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[4.5, 2]} />
        <meshStandardMaterial 
          color={isLocked ? '#ff4444' : ET.accent} 
          wireframe 
          transparent
          opacity={0.15}
          depthWrite={false}
        />
        {/* Glowing edges */}
        <Icosahedron args={[4.5, 2]}>
          <meshStandardMaterial 
            color={isLocked ? '#ff4444' : ET.accent} 
            wireframe 
            emissive={isLocked ? '#ff4444' : ET.accent}
            emissiveIntensity={0.2}
            transparent
            opacity={0.1}
          />
        </Icosahedron>
      </mesh>

      {/* Biological Interaction Nodes — AnimatePresence does not work on
          Three.js <group>, so it was a no-op. Just conditionally render. (#56) */}
      {isLocked && (
        <group>
          {bioNodes.map((node) => (
            <BioNode
              key={node.key}
              position={node.pos}
              label={node.label}
              icon={node.icon}
              active={sensory[node.key as keyof typeof sensory]}
              onClick={() => setSensory({ [node.key]: true })}
            />
          ))}
        </group>
      )}
    </group>
  )
}
