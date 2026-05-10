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
    durationRemaining: 600,
    startTime: Date.now(),
    targetNodeId
  }),
  stop: () => set(INITIAL_IGNITION_STATE),
  setPhase: (phase) => set({ currentPhase: phase }),
  tick: () => {
    const state = get();
    if (!state.isActive) return;
    // If the timer already ran out, do not reset — preserve targetNodeId
    // so the handoff effect in page.tsx can still read it (#13).
    if (state.durationRemaining <= 0) return;

    // Drift-free remaining time: compute from startTime instead of decrementing (#25).
    const elapsed = state.startTime
      ? Math.floor((Date.now() - state.startTime) / 1000)
      : 0;
    const nextRemaining = Math.max(0, 600 - elapsed);

    if (nextRemaining === 0) {
      set({
        isActive: false,
        currentPhase: 'idle',
        durationRemaining: 0,
        // Preserve targetNodeId for the handoff effect.
      });
      return;
    }

    // Phase logic for 600s:
    // 480-600s: Spark (120s) - Physical Activation
    // 300-480s: Target (180s) - Mental Alignment
    // 0-300s: Launch (300s) - Deep Work Ignition
    let nextPhase: IgnitionPhase = state.currentPhase;
    if (nextRemaining > 480) nextPhase = 'spark';
    else if (nextRemaining > 300) nextPhase = 'target';
    else nextPhase = 'launch';

    set({ durationRemaining: nextRemaining, currentPhase: nextPhase });
  }
}));
