'use client'
import { useEffect, useState, useCallback } from 'react';
import { useIgnitionStore, type IgnitionPhase } from '../../lib/ignition-store';
import { ignitionAudio } from '../../lib/ignition-audio';

const SPARK_ACTIONS = [
  "JUMPING JACKS",
  "HIGH KNEES", 
  "DEEP SQUATS",
  "ARM CIRCLES",
  "BURPEES",
  "PUSH-UPS",
  "MOUNTAIN CLIMBERS",
  "TOE TOUCHES",
  "JOG IN PLACE",
  "STRETCH SIDE TO SIDE",
  "POWER SKIPS",
  "LUNGES",
  "SHADOW BOX",
  "DEEP BREATHING",
  "DESPERATE NEED STRETCH"
];

export const IgnitionOverlay = () => {
  const { currentPhase, durationRemaining, isActive, stop, tick } = useIgnitionStore();
  const [currentAction, setCurrentAction] = useState<string>("");
  const [audioEnabled, setAudioEnabled] = useState(true);

  const getRandomAction = useCallback(() => {
    return SPARK_ACTIONS[Math.floor(Math.random() * SPARK_ACTIONS.length)];
  }, []);

  const toggleAudio = () => {
    const newState = ignitionAudio.toggle();
    setAudioEnabled(newState);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, tick]);

  useEffect(() => {
    if (isActive && currentPhase === 'spark') {
      setCurrentAction(getRandomAction());
      const actionInterval = setInterval(() => {
        setCurrentAction(getRandomAction());
      }, 3000);
      return () => clearInterval(actionInterval);
    }
  }, [isActive, currentPhase, getRandomAction]);

  // Start/transition audio whenever phase changes. Do NOT stop on cleanup —
  // that would create an audible gap on every phase transition (#16).
  useEffect(() => {
    if (isActive && currentPhase !== 'idle') {
      ignitionAudio.playPhase(currentPhase);
    } else {
      ignitionAudio.stop();
    }
  }, [isActive, currentPhase]);

  // Stop audio only when the overlay actually unmounts.
  useEffect(() => () => { ignitionAudio.stop(); }, []);

  if (!isActive) return null;

  const prompts = {
    spark: "IGNITE YOUR NERVOUS SYSTEM MOVE NOW",
    target: "ALIGN WITH YOUR PRIMARY GOALS",
    launch: "PREPARE FOR DEEP WORK FOCUS",
    idle: ""
  };

  // Static class strings so Tailwind's content scanner can keep them in production (#17).
  const phaseColors: Record<IgnitionPhase, string> = {
    spark: "text-rose-500 border-rose-500",
    target: "text-cyan-400 border-cyan-400",
    launch: "text-emerald-400 border-emerald-400",
    idle: ""
  };
  const progressColors: Record<IgnitionPhase, string> = {
    spark:  'bg-rose-500',
    target: 'bg-cyan-400',
    launch: 'bg-emerald-400',
    idle:   'bg-white/10',
  };
  const bgPulseColors: Record<IgnitionPhase, string> = {
    spark:  'bg-rose-500',
    target: 'bg-cyan-400',
    launch: 'bg-emerald-400',
    idle:   'bg-transparent',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 font-mono overflow-hidden">
      {/* Background Pulse Effect */}
      <div className={`absolute inset-0 opacity-10 animate-pulse ${bgPulseColors[currentPhase]}`} />
      
      {/* Audio Toggle */}
      <button 
        onClick={toggleAudio}
        className="absolute top-6 right-6 z-20 text-white/50 hover:text-white transition-colors"
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>
      
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className={`text-[120px] font-black tracking-tighter mb-4 leading-none ${phaseColors[currentPhase]}`}>
          {durationRemaining}s
        </div>
        
        <div className={`text-2xl font-bold tracking-[0.3em] uppercase mb-4 max-w-2xl ${phaseColors[currentPhase]}`}>
          {prompts[currentPhase]}
        </div>

        {currentPhase === 'spark' && currentAction && (
          <div className={`text-lg font-bold tracking-widest uppercase animate-pulse ${phaseColors[currentPhase]}`}>
            {currentAction}
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button 
            onClick={stop}
            className="border border-white/20 bg-white/5 hover:bg-white/10 text-white/50 px-8 py-3 tracking-widest uppercase text-xs transition-all"
          >
            Abort Mission
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
        <div
          className={`h-full transition-all duration-1000 ${progressColors[currentPhase]}`}
          style={{ width: `${(durationRemaining / 600) * 100}%` }}
        />
      </div>
    </div>
  );
};
