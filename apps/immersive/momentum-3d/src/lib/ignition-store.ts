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
    durationRemaining: 60, // Reduced to 60s for testing
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
    // Adjusted phase logic for 60s total:
    // 0-30s: launch
    // 30-48s: target
    // 48-60s: spark
    
    if (nextRemaining <= 30) nextPhase = 'launch';
    else if (nextRemaining <= 48) nextPhase = 'target';
    else nextPhase = 'spark';
    
    set({ durationRemaining: nextRemaining, currentPhase: nextPhase });
  }
}));
