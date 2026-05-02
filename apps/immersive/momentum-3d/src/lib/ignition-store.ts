import { create } from 'zustand';

export type IgnitionPhase = 'spark' | 'target' | 'launch' | 'idle';

export interface IgnitionState {
  currentPhase: IgnitionPhase;
  startTime: number | null;
  durationRemaining: number;
  isActive: boolean;
}

export const INITIAL_IGNITION_STATE: IgnitionState = {
  currentPhase: 'idle',
  startTime: null,
  durationRemaining: 0,
  isActive: false,
};

interface IgnitionStore extends IgnitionState {
  start: () => void;
  stop: () => void;
  tick: () => void;
  setPhase: (phase: IgnitionPhase) => void;
}

export const useIgnitionStore = create<IgnitionStore>((set, get) => ({
  ...INITIAL_IGNITION_STATE,
  start: () => set({ isActive: true, currentPhase: 'spark', durationRemaining: 600, startTime: Date.now() }),
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
      set(INITIAL_IGNITION_STATE);
      return;
    }

    let nextPhase = currentPhase;
    // Phase logic:
    // 0-300s: launch (5 mins)
    // 300-480s: target (3 mins)
    // 480-600s: spark (2 mins)
    
    if (nextRemaining <= 300) nextPhase = 'launch';
    else if (nextRemaining <= 480) nextPhase = 'target';
    else nextPhase = 'spark';
    
    set({ durationRemaining: nextRemaining, currentPhase: nextPhase });
  }
}));
