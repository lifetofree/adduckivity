'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ET } from '@/lib/theme'

const LOW  = new THREE.Color('#ff4444')
const MID  = new THREE.Color('#f59e0b')
const HIGH = new THREE.Color('#00E5FF')

function targetOrbColor(energy: number): THREE.Color {
  if (energy <= 3) return LOW.clone()
  if (energy <= 6) return MID.clone()
  return HIGH.clone()
}

function EnergyOrb({ energy }: { energy: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.MeshStandardMaterial>(null)
  const targetColor = targetOrbColor(energy)
  const targetScale = 0.65 + (energy / 10) * 0.7

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return
    meshRef.current.rotation.y += delta * 0.25
    meshRef.current.rotation.x += delta * 0.08
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 2.5)
    )
    matRef.current.emissive.lerp(targetColor, delta * 2.5)
    matRef.current.color.lerp(targetColor, delta * 2.5)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color={targetColor}
        emissive={targetColor}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  )
}

export default function StateCheckScene({ energy }: { energy: number }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={[ET.bg]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 4, 4]} intensity={3} />
      <pointLight position={[-4, -4, -4]} intensity={0.5} color="#6366f1" />
      <Stars radius={80} depth={50} count={2500} factor={3} fade speed={0.5} />
      <EnergyOrb energy={energy} />
    </Canvas>
  )
}
