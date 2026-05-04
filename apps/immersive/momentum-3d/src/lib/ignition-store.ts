import { create } from 'zustand';

export type IgnitionPhase = 'spark' | 'target' | 'launch' | 'idle';

export interface IgnitionState {
  currentPhase: IgnitionPhase;
  startTime: number | null;
  durationRemaining: number;
  isActive: boolean;
  targetNodeId: string | null;
}

export const INITIAL_IGNITION_STATE: IgnitionState = {
  currentPhase: 'idle',
  startTime: null,
  durationRemaining: 0,
  isActive: false,
  targetNodeId: null,
};

interface IgnitionStore extends IgnitionState {
  start: (targetNodeId?: string | null) => void;
  stop: () => void;
  tick: () => void;
  setPhase: (phase: IgnitionPhase) => void;
}

export const useIgnitionStore = create<IgnitionStore>((set, get) => ({
  ...INITIAL_IGNITION_STATE,
  start: (targetNodeId = null) => set({ 
    isActive: true, 
    currentPhase: 'spark', 
    durationRemaining: 60, // Test mode: 60s instead of 600s
    startTime: Date.now(),
    targetNodeId
  }),
  stop: () => set(INITIAL_IGNITION_STATE),
  setPhase: (phase) => set({ currentPhase: phase }),
  tick: () => {
    const { durationRemaining, currentPhase } = get();
    if (!get().isActive) return;

    if (durationRemaining <= 0) {
      set(INITIAL_IGNITION_STATE);
      return;
    }

    const nextRemaining = durationRemaining - 1;

    if (nextRemaining === 0) {
      set({ 
        isActive: false, 
        currentPhase: 'idle', 
        durationRemaining: 0,
        // We preserve targetNodeId here so the handoff effect in page.tsx can read it
      });
      return;
    }

    let nextPhase = currentPhase;
    // Phase logic for 60s test (scaled from 600s):
    // 48-60s: Spark (first 12s) - Physical Activation
    // 30-48s: Target (next 18s) - Mental Alignment  
    // 0-30s: Launch (final 30s) - Deep Work Ignition
    
    if (nextRemaining > 48) nextPhase = 'spark';
    else if (nextRemaining > 30) nextPhase = 'target';
    else nextPhase = 'launch';
    
    set({ durationRemaining: nextRemaining, currentPhase: nextPhase });
  }
}));
