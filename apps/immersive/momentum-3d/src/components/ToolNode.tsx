'use client'

import React, { useState, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { ET } from '@/lib/theme'

// Hoisted reusable Vector3s to avoid per-frame allocations (#53).
const _launchTarget = new THREE.Vector3()
const _launchOffset = new THREE.Vector3(0, 0, 2)
const _lookAt = new THREE.Vector3()
const _hoverScale = new THREE.Vector3(1.3, 1.3, 1.3)
const _baseScale = new THREE.Vector3(1, 1, 1)

interface ToolNodeProps {
  position: [number, number, number]
  title: string
  href: string
  color: string
  type: 'sphere' | 'tetrahedron' | 'octahedron' | 'dodecahedron'
  isDisabled?: boolean
  description: string
}

export default function ToolNode({ 
  position, 
  title, 
  href, 
  color, 
  type, 
  isDisabled = false,
  description
}: ToolNodeProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    const a = new Audio('/audio/launch-phase.mp3')
    a.volume = 0.5
    audioRef.current = a
    // Clean up the element when the node unmounts to avoid leaks (#54).
    return () => {
      a.pause()
      a.src = ''
      audioRef.current = null
    }
  }, [])

  // Memoize the position vector so it isn't re-derived every frame (#53).
  const positionVec = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += isLaunching ? 0.2 : 0.01
      meshRef.current.rotation.x += 0.005

      if (isLaunching) {
        _launchTarget.copy(positionVec).add(_launchOffset)
        state.camera.position.lerp(_launchTarget, 0.05)
        state.camera.lookAt(_lookAt.copy(positionVec))
      } else if (hovered && !isDisabled) {
        meshRef.current.scale.lerp(_hoverScale, 0.1)
      } else {
        meshRef.current.scale.lerp(_baseScale, 0.1)
      }
    }
  })

  const handlePointerOver = () => !isDisabled && setHovered(true)
  const handlePointerOut = () => setHovered(false)
  
  const handleClick = () => {
    if (!isDisabled && !isLaunching) {
      setIsLaunching(true)
      audioRef.current?.play().catch(() => {})
      
      // Delay navigation to show the flight effect
      setTimeout(() => {
        router.push(href)
      }, 1500)
    }
  }

  const renderGeometry = () => {
    switch (type) {
      case 'sphere': return <sphereGeometry args={[0.7, 32, 32]} />
      case 'tetrahedron': return <tetrahedronGeometry args={[0.8]} />
      case 'octahedron': return <octahedronGeometry args={[0.8]} />
      case 'dodecahedron': return <dodecahedronGeometry args={[0.7]} />
      default: return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
        <mesh
          ref={meshRef}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
          castShadow
        >
          {renderGeometry()}
          <meshStandardMaterial 
            color={isDisabled ? '#444' : (hovered ? ET.accent : color)} 
            emissive={isDisabled ? '#111' : (hovered ? ET.accent : color)}
            emissiveIntensity={hovered ? 5 : 1.5}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={isDisabled ? 0.4 : 1}
          />
        </mesh>

        <pointLight intensity={2} distance={5} color={color} />

        <Text
          position={[0, -1.4, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {title.toUpperCase()}
        </Text>

        {hovered && !isDisabled && (
          <Html distanceFactor={10} position={[0, 1.5, 0]}>
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl w-48 pointer-events-none">
              <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-1">Active Tool</p>
              <h3 className="text-white text-xs font-bold mb-2">{title}</h3>
              <p className="text-white/60 text-[9px] leading-relaxed">{description}</p>
            </div>
          </Html>
        )}

        {isDisabled && (
          <Html distanceFactor={10} position={[0, 1.5, 0]}>
            <div className="bg-red-950/40 backdrop-blur-md border border-red-500/20 p-4 rounded-xl w-48 pointer-events-none grayscale">
              <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold mb-1">Offline</p>
              <h3 className="text-white/40 text-xs font-bold mb-2">{title}</h3>
              <p className="text-white/20 text-[9px] leading-relaxed">System complexity too high for current energy level.</p>
            </div>
          </Html>
        )}
      </Float>
    </group>
  )
}
