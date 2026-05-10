export interface SystemState {
  energy: number
  isLocked: boolean
  isProtected: boolean
}

export interface ProtocolRecommendation {
  label: string
  route: string
  toolName: string
  colorHex: string
  tagline: string
}

export function getRecommendation({ energy, isLocked }: Pick<SystemState, 'energy' | 'isLocked'>): ProtocolRecommendation {
  // Critical or low energy always routes to emergency — energy state takes priority over lock
  if (energy <= 3) {
    return {
      label: energy <= 2 ? 'System Critical' : 'Crash State',
      route: '/momentum',
      toolName: 'Emergency Recovery',
      colorHex: '#ff4444',
      tagline: '5-step fail-safe reset. Under 10 minutes.',
    }
  }

  // Mid-range + locked sensory: also route to emergency
  if (energy <= 6 && isLocked) {
    return {
      label: 'Biological Lock',
      route: '/momentum',
      toolName: 'Emergency Recovery',
      colorHex: '#ff4444',
      tagline: '5-step fail-safe reset. Restore before proceeding.',
    }
  }

  // Mid-range, not locked: atomizer
  if (energy <= 6) {
    return {
      label: 'Low Fuel',
      route: '/atomizer',
      toolName: 'The Atomizer',
      colorHex: '#f59e0b',
      tagline: 'Break it into 2-minute steps. No overwhelm.',
    }
  }

  // High energy + locked sensory: downgrade to atomizer (still have energy, just poor environment)
  if (isLocked) {
    return {
      label: 'Low Fuel',
      route: '/atomizer',
      toolName: 'The Atomizer',
      colorHex: '#f59e0b',
      tagline: 'Break it into 2-minute steps. No overwhelm.',
    }
  }

  // High energy, clear: ignition
  return {
    label: 'Flight Ready',
    route: '/ignition',
    toolName: 'Ignition Sequence',
    colorHex: '#00E5FF',
    tagline: '600-second power-up ritual. Build momentum.',
  }
}
