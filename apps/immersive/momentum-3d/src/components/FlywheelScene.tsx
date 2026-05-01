'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function Flywheel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef(scrollProgress)

  useEffect(() => { progressRef.current = scrollProgress }, [scrollProgress])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const speed = 0.25 + progressRef.current * 1.4
    groupRef.current.rotation.y += delta * speed
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      progressRef.current * 0.35,
      delta * 2
    )
  })

  return (
    <group ref={groupRef}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[2, 0.22, 16, 100]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.45} metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Inner tilted ring */}
      <mesh rotation={[Math.PI / 3.5, 0, 0]}>
        <torusGeometry args={[1.35, 0.12, 16, 80]} />
        <meshStandardMaterial color="#0099BB" emissive="#00E5FF" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.2} metalness={0.9} roughness={0.05} />
      </mesh>

      {/* Spokes */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
          <boxGeometry args={[0.05, 3.6, 0.05]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.25} metalness={0.8} roughness={0.2} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const progressRef = useRef(scrollProgress)

  useEffect(() => { progressRef.current = scrollProgress }, [scrollProgress])

  const positions = useRef(() => {
    const count = 700
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22
    }
    return arr
  }).current()

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.025
    if (matRef.current) {
      matRef.current.opacity = THREE.MathUtils.lerp(
        matRef.current.opacity,
        0.15 + progressRef.current * 0.45,
        delta * 2
      )
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={700} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} size={0.04} color="#00E5FF" transparent opacity={0.15} />
    </points>
  )
}

export default function FlywheelScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="w-full h-screen fixed top-0 left-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={55} />
        <ambientLight intensity={0.2} />
        <pointLight position={[8, 8, 8]} intensity={2} color="#00E5FF" />
        <pointLight position={[-8, -8, -4]} intensity={1} color="#0044AA" />
        <Flywheel scrollProgress={scrollProgress} />
        <ParticleField scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
