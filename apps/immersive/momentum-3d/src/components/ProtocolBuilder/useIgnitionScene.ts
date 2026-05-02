import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useIgnitionStore } from '../../lib/ignition-store';

export const useIgnitionScene = () => {
  const { currentPhase, isActive } = useIgnitionStore();
  const uniforms = useRef({
    pulseIntensity: 0,
    cameraShake: 0,
  });
  
  const colors = useMemo(() => {
    if (!isActive) return null;
    switch (currentPhase) {
      case 'spark': return { bg: '#1a0505', primary: '#ff0055', accent: '#ffaa00' };
      case 'target': return { bg: '#05051a', primary: '#00f3ff', accent: '#0055ff' };
      case 'launch': return { bg: '#051a05', primary: '#00ff66', accent: '#ffffff' };
      default: return null;
    }
  }, [currentPhase, isActive]);

  useFrame((state) => {
    if (!isActive) {
      uniforms.current.pulseIntensity = 0;
      uniforms.current.cameraShake = 0;
      return;
    }
    
    const time = state.clock.elapsedTime;
    
    if (currentPhase === 'spark') {
      uniforms.current.pulseIntensity = Math.sin(time * 12) * 0.5 + 0.5;
      uniforms.current.cameraShake = (Math.random() - 0.5) * 0.02;
    } else if (currentPhase === 'target') {
      uniforms.current.pulseIntensity = Math.sin(time * 2) * 0.2 + 0.3;
      uniforms.current.cameraShake = 0;
    } else if (currentPhase === 'launch') {
      uniforms.current.pulseIntensity = 0.8 + Math.sin(time * 20) * 0.2;
      uniforms.current.cameraShake = (Math.random() - 0.5) * 0.005;
    }
  });

  return { colors, uniforms: uniforms.current };
};
