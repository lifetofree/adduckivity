'use client'
import { useEffect } from 'react';
import { useIgnitionStore } from '../../lib/ignition-store';

export const IgnitionOverlay = () => {
  const { currentPhase, durationRemaining, isActive, stop, tick } = useIgnitionStore();

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

  if (!isActive) return null;

  const prompts = {
    spark: "IGNITE YOUR NERVOUS SYSTEM - MOVE NOW",
    target: "ALIGN WITH YOUR PRIMARY GOALS",
    launch: "PREPARE FOR DEEP WORK FOCUS",
    idle: ""
  };

  const phaseColors = {
    spark: "text-rose-500 border-rose-500",
    target: "text-cyan-400 border-cyan-400",
    launch: "text-emerald-400 border-emerald-400",
    idle: ""
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 font-mono overflow-hidden">
      {/* Background Pulse Effect */}
      <div className={`absolute inset-0 opacity-10 animate-pulse bg-current ${phaseColors[currentPhase]}`} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className={`text-[120px] font-black tracking-tighter mb-4 leading-none ${phaseColors[currentPhase]}`}>
          {durationRemaining}s
        </div>
        
        <div className={`text-2xl font-bold tracking-[0.3em] uppercase mb-8 max-w-2xl ${phaseColors[currentPhase]}`}>
          {prompts[currentPhase]}
        </div>
        
        <div className="flex gap-4">
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
          className={`h-full transition-all duration-1000 ${phaseColors[currentPhase].split(' ')[0].replace('text', 'bg')}`}
          style={{ width: `${(durationRemaining / 60) * 100}%` }} // Adjusted to 60s for testing
        />
      </div>
    </div>
  );
};
