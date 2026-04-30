'use client'
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ET } from '@/lib/theme';

function TaskOrb({ shatter = false }) {
  const particlesRef = useRef<THREE.Points>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);

  const count = 3000;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Create spherical distribution
      const radius = 2.0 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = radius * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rotate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.1;
      particlesRef.current.rotation.x = t * 0.05;

      if (shatter) {
        // Shatter: expand particles outward
        particlesRef.current.scale.multiplyScalar(1.02);
        if (particlesRef.current.material instanceof THREE.Material) {
          particlesRef.current.material.opacity = Math.min(1, particlesRef.current.material.opacity + 0.03);
        }
      } else {
        // Pulsing breathing effect
        const pulse = 1 + Math.sin(t * 1.2) * 0.08;
        particlesRef.current.scale.set(pulse, pulse, pulse);
        if (particlesRef.current.material instanceof THREE.Material) {
          particlesRef.current.material.opacity = 0.7 + Math.sin(t * 1.2) * 0.15;
        }
      }
    }

    // Rotate core sphere
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.08;
      
      if (shatter) {
        coreRef.current.scale.multiplyScalar(0.97);
        if (coreRef.current.material instanceof THREE.Material) {
          coreRef.current.material.opacity = Math.max(0, coreRef.current.material.opacity - 0.05);
        }
      } else {
        const pulse = 1 + Math.sin(t * 1.2) * 0.05;
        coreRef.current.scale.set(pulse, pulse, pulse);
        if (coreRef.current.material instanceof THREE.Material) {
          coreRef.current.material.opacity = 0.15;
        }
      }
    }
  });

  return (
    <group>
      {/* Core wireframe sphere */}
      <Sphere ref={coreRef} args={[1.8, 32, 32]}>
        <meshBasicMaterial 
          color={ET.accent} 
          wireframe 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Particle cloud */}
      <Points ref={particlesRef} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={ET.accent}
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function AtomizerScene({ shatter = false }) {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
        <color attach="background" args={[ET.bg]} />
        <ambientLight intensity={0.8} />
        <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.2}>
          <TaskOrb shatter={shatter} />
        </Float>
      </Canvas>
    </div>
  );
}
