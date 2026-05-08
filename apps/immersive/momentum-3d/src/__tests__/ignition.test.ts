import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useIgnitionStore, INITIAL_IGNITION_STATE } from '../lib/ignition-store';

describe('IgnitionStore', () => {
  beforeEach(() => {
    useIgnitionStore.setState(INITIAL_IGNITION_STATE);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts in idle', () => {
    expect(useIgnitionStore.getState().currentPhase).toBe('idle');
    expect(useIgnitionStore.getState().isActive).toBe(false);
  });

  it('start() initialises phase, duration, and startTime', () => {
    useIgnitionStore.getState().start('node-42');
    const s = useIgnitionStore.getState();
    expect(s.isActive).toBe(true);
    expect(s.currentPhase).toBe('spark');
    expect(s.durationRemaining).toBe(600);
    expect(s.targetNodeId).toBe('node-42');
    expect(s.startTime).not.toBeNull();
  });

  it('transitions through phases at the correct elapsed wall time (drift-free, #25)', () => {
    useIgnitionStore.getState().start();
    // Spark phase: 600 → 481 (still spark)
    vi.advanceTimersByTime(120_000); // 120s elapsed → 480s remaining
    useIgnitionStore.getState().tick();
    expect(useIgnitionStore.getState().durationRemaining).toBe(480);
    expect(useIgnitionStore.getState().currentPhase).toBe('target');

    // Target phase: 480 → 300
    vi.advanceTimersByTime(180_000); // total 300s elapsed → 300s remaining
    useIgnitionStore.getState().tick();
    expect(useIgnitionStore.getState().durationRemaining).toBe(300);
    expect(useIgnitionStore.getState().currentPhase).toBe('launch');

    // Launch phase: 300 → 0
    vi.advanceTimersByTime(300_000); // total 600s elapsed → 0s remaining
    useIgnitionStore.getState().tick();
    expect(useIgnitionStore.getState().durationRemaining).toBe(0);
    expect(useIgnitionStore.getState().isActive).toBe(false);
    expect(useIgnitionStore.getState().currentPhase).toBe('idle');
  });

  // Regression test for ISSUESTOFIX #13: an extra tick after the timer ends
  // must NOT clear targetNodeId.
  it('preserves targetNodeId after completion even on stray late ticks (#13)', () => {
    useIgnitionStore.getState().start('handoff-target');
    vi.advanceTimersByTime(600_000);
    useIgnitionStore.getState().tick(); // first completion tick
    expect(useIgnitionStore.getState().isActive).toBe(false);
    expect(useIgnitionStore.getState().targetNodeId).toBe('handoff-target');

    // Simulate a stray interval firing after completion.
    useIgnitionStore.getState().tick();
    useIgnitionStore.getState().tick();
    expect(useIgnitionStore.getState().targetNodeId).toBe('handoff-target');
    expect(useIgnitionStore.getState().durationRemaining).toBe(0);
  });

  it('can be stopped', () => {
    useIgnitionStore.getState().start();
    useIgnitionStore.getState().stop();
    expect(useIgnitionStore.getState().isActive).toBe(false);
    expect(useIgnitionStore.getState().currentPhase).toBe('idle');
    expect(useIgnitionStore.getState().targetNodeId).toBeNull();
  });

  it('tick() is a no-op when not active', () => {
    useIgnitionStore.getState().tick();
    expect(useIgnitionStore.getState().durationRemaining).toBe(0);
    expect(useIgnitionStore.getState().isActive).toBe(false);
  });
});
