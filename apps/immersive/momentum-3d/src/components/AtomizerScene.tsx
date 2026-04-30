'use client'
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ET } from '@/lib/theme';

function TaskOrb({ shatter = false }) {
  const particlesRef = useRef<THREE.Points>(null!);

  const count = 4000;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Concentrate particles near the surface of a sphere (r=2.2) with slight spread
      const radius = 2.2 + (Math.random() - 0.5) * 0.6;
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
    if (!particlesRef.current) return;

    if (shatter) {
      particlesRef.current.scale.multiplyScalar(1.025);
      if (particlesRef.current.material instanceof THREE.Material) {
        particlesRef.current.material.opacity = Math.min(1, particlesRef.current.material.opacity + 0.05);
      }
    } else {
      const pulse = 1 + Math.sin(t * 1.5) * 0.06;
      particlesRef.current.rotation.y = t * 0.12;
      particlesRef.current.rotation.z = t * 0.05;
      particlesRef.current.scale.set(pulse, pulse, pulse);
      if (particlesRef.current.material instanceof THREE.Material) {
        particlesRef.current.material.opacity = 0.82 + Math.sin(t * 1.5) * 0.12;
      }
    }
  });

  return (
    <Points ref={particlesRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={ET.accent}
        size={0.07}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.82}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function AtomizerScene({ shatter = false }) {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={[ET.bg]} />
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
          <TaskOrb shatter={shatter} />
        </Float>
      </Canvas>
    </div>
  );
}
