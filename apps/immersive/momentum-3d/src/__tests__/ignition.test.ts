import { describe, it, expect, beforeEach } from 'vitest';
import { useIgnitionStore, INITIAL_IGNITION_STATE } from '../lib/ignition-store';

describe('IgnitionStore', () => {
  beforeEach(() => {
    useIgnitionStore.setState(INITIAL_IGNITION_STATE);
  });

  it('starts in idle', () => {
    expect(useIgnitionStore.getState().currentPhase).toBe('idle');
    expect(useIgnitionStore.getState().isActive).toBe(false);
  });

  it('transitions through phases correctly', () => {
    useIgnitionStore.getState().start();
    expect(useIgnitionStore.getState().currentPhase).toBe('spark');
    expect(useIgnitionStore.getState().durationRemaining).toBe(600);
    
    // Fast forward through spark (120s)
    for(let i = 0; i < 120; i++) {
      useIgnitionStore.getState().tick();
    }
    // At 480 remaining, it should transition to target
    expect(useIgnitionStore.getState().durationRemaining).toBe(480);
    expect(useIgnitionStore.getState().currentPhase).toBe('target');

    // Fast forward through target (180s)
    for(let i = 0; i < 180; i++) {
      useIgnitionStore.getState().tick();
    }
    // At 300 remaining, it should transition to launch
    expect(useIgnitionStore.getState().durationRemaining).toBe(300);
    expect(useIgnitionStore.getState().currentPhase).toBe('launch');

    // Fast forward to end
    for(let i = 0; i < 300; i++) {
      useIgnitionStore.getState().tick();
    }
    expect(useIgnitionStore.getState().durationRemaining).toBe(0);
    expect(useIgnitionStore.getState().isActive).toBe(false);
    expect(useIgnitionStore.getState().currentPhase).toBe('idle');
  });

  it('can be stopped', () => {
    useIgnitionStore.getState().start();
    useIgnitionStore.getState().stop();
    expect(useIgnitionStore.getState().isActive).toBe(false);
    expect(useIgnitionStore.getState().currentPhase).toBe('idle');
  });
});
