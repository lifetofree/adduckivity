'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function Flywheel({ scrollProgress }: { scrollProgress: number }) {
  const flywheelRef = useRef<THREE.Mesh>(null)
  
  useEffect(() => {
    if (flywheelRef.current) {
      // Rotation speed based on scroll progress
      const rotationSpeed = scrollProgress * 0.1
      flywheelRef.current.rotation.y += rotationSpeed
      flywheelRef.current.rotation.x = scrollProgress * 0.05
    }
  }, [scrollProgress])

  return (
    <group position={[0, 0, 0]}>
      {/* Main flywheel ring */}
      <mesh ref={flywheelRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[2, 0.3, 16, 100]} />
        <meshStandardMaterial 
          color="#00ff88" 
          emissive="#00ff88"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <torusGeometry args={[1.5, 0.2, 16, 100]} />
        <meshStandardMaterial 
          color="#00cc66" 
          emissive="#00cc66"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Core hub */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
        <meshStandardMaterial 
          color="#00ff88" 
          emissive="#00ff88"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Spokes */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh 
          key={i}
          rotation={[0, 0, (i * Math.PI) / 4]}
          position={[0, 0, 0]}
        >
          <boxGeometry args={[0.1, 3.5, 0.1]} />
          <meshStandardMaterial 
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function DuckAvatar() {
  return (
    <group position={[3, 0, 2]} scale={0.5}>
      {/* Simple duck representation - minimal geometric style */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Duck bill */}
      <mesh position={[0, 0.3, 0.7]}>
        <coneGeometry args={[0.3, 0.5, 32]} />
        <meshStandardMaterial 
          color="#ff6b35"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Duck eyes */}
      <mesh position={[-0.3, 0.6, 0.6]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.6, 0.6]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  )
}

function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = 500
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#00ff88"
        transparent
        opacity={0.6 * (0.3 + scrollProgress * 0.7)}
      />
    </points>
  )
}

export default function FlywheelScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="w-full h-screen fixed top-0 left-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
        
        {/* 3D Objects */}
        <Flywheel scrollProgress={scrollProgress || 0} />
        <DuckAvatar />
        <ParticleField scrollProgress={scrollProgress || 0} />
        
        {/* Environment */}
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
