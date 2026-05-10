'use client'

import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { ET } from '@/lib/theme'

// Reusable scratch vector to avoid per-frame allocations (#53).
const _scaleTarget = new THREE.Vector3()

interface RoadmapNodeProps {
  position: [number, number, number]
  isExpanded: boolean
  onToggle: () => void
}

export default function RoadmapNode({ position, isExpanded, onToggle }: RoadmapNodeProps) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += isExpanded ? 0.05 : 0.01
      meshRef.current.rotation.z += isExpanded ? 0.02 : 0.005

      const targetScale = hovered ? 1.2 : 1
      meshRef.current.scale.lerp(_scaleTarget.set(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          castShadow
        >
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial 
            color={isExpanded ? ET.accent : '#555'} 
            emissive={isExpanded ? ET.accent : '#333'}
            emissiveIntensity={isExpanded ? 1 : 0.2}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Low opacity background for label */}
        <mesh position={[0, -1.5, -0.01]}>
          <planeGeometry args={[3.5, 0.6]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {isExpanded ? 'SYSTEM BLUEPRINT' : 'ROADMAP'}
        </Text>

        {hovered && !isExpanded && (
          <Html distanceFactor={10} position={[0, 1.8, 0]}>
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl w-48 pointer-events-none">
              <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-1">Architecture</p>
              <h3 className="text-white text-xs font-bold mb-2">Project Roadmap</h3>
              <p className="text-white/60 text-[9px] leading-relaxed">Expand to visualize and manage implementation phases.</p>
            </div>
          </Html>
        )}
      </Float>
    </group>
  )
}
