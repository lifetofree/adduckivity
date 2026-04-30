'use client'
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ET } from '@/lib/theme';

function TaskOrb({ shatter = false }) {
  const orbRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  
  const count = 1000;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = radius * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rotate everything
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.2;
      orbRef.current.rotation.x = t * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.15;
      particlesRef.current.rotation.z = t * 0.05;
    }

    if (shatter) {
      // Shatter effect: Fade out orb, explode particles
      if (orbRef.current) {
        orbRef.current.scale.multiplyScalar(0.98);
        if (orbRef.current.material instanceof THREE.Material) {
          orbRef.current.material.opacity = Math.max(0, orbRef.current.material.opacity - 0.05);
        }
      }
      if (particlesRef.current) {
        particlesRef.current.scale.multiplyScalar(1.02);
        if (particlesRef.current.material instanceof THREE.Material) {
          particlesRef.current.material.opacity = Math.min(1, particlesRef.current.material.opacity + 0.05);
        }
      }
    } else {
      // Pulsing effect when not shattered
      const pulse = 1 + Math.sin(t * 2) * 0.05;
      if (orbRef.current) {
        orbRef.current.scale.set(pulse, pulse, pulse);
        if (orbRef.current.material instanceof THREE.Material) {
          orbRef.current.material.opacity = 0.3;
        }
      }
      if (particlesRef.current) {
        particlesRef.current.scale.set(1, 1, 1);
        if (particlesRef.current.material instanceof THREE.Material) {
          particlesRef.current.material.opacity = 0.2;
        }
      }
    }
  });

  return (
    <group>
      {/* The Core Orb */}
      <Sphere ref={orbRef} args={[2, 32, 32]}>
        <meshBasicMaterial 
          color={ET.accent} 
          wireframe 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* The Particles */}
      <Points ref={particlesRef} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={ET.accent}
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function AtomizerScene({ shatter = false }) {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <color attach="background" args={[ET.bg]} />
        <ambientLight intensity={0.5} />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <TaskOrb shatter={shatter} />
        </Float>
      </Canvas>
    </div>
  );
}
