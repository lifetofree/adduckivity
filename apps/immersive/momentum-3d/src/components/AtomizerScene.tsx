'use client'
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ET } from '@/lib/theme';

function Particles({ count = 500, shatter = false }) {
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

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    ref.current.rotation.y += 0.002;
    ref.current.rotation.x += 0.001;
    if (shatter) {
        // Expand particles outwards
        ref.current.scale.multiplyScalar(1.005);
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={ET.accent}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function AtomizerScene({ shatter = false }) {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={[ET.bg]} />
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Particles shatter={shatter} />
        </Float>
      </Canvas>
    </div>
  );
}
