'use client'
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ET } from '@/lib/theme';

function TaskOrb({ shatter = false }) {
  const particlesRef = useRef<THREE.Points>(null!);
  const timeRef = useRef(0);

  const count = 3000;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = radius * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    
    timeRef.current += delta;

    if (shatter) {
      particlesRef.current.scale.multiplyScalar(1.02);
      if (particlesRef.current.material instanceof THREE.Material) {
        particlesRef.current.material.opacity = Math.min(0.5, particlesRef.current.material.opacity + 0.03);
      }
    } else {
      const t = timeRef.current;
      const pulse = 1 + Math.sin(t * 1.2) * 0.04;
      particlesRef.current.rotation.y = t * 0.08;
      particlesRef.current.rotation.x = t * 0.03;
      particlesRef.current.scale.set(pulse, pulse, pulse);
      if (particlesRef.current.material instanceof THREE.Material) {
        particlesRef.current.material.opacity = 0.20 + Math.sin(t * 1.2) * 0.04;
      }
    }
  });

  return (
    <Points ref={particlesRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={ET.accent}
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.20}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function AtomizerScene({ shatter = false }) {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
        <color attach="background" args={[ET.bg]} />
        <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.2}>
          <TaskOrb shatter={shatter} />
        </Float>
      </Canvas>
    </div>
  );
}
