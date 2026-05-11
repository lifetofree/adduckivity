// Synthesises timer completion sounds via Web Audio API — no external files needed.
// Respects isProtected (sensory mode): caller passes muted=true to silence.

export type TimerSound = 'chime' | 'beep' | 'duck'

const SOUND_KEY = 'duckos:timer:sound'

function makeContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext
    || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  return AC ? new AC() : null
}

function playChime(ctx: AudioContext) {
  // 3 descending notes: A5 → E5 → C5
  const notes = [880, 659, 523]
  let t = ctx.currentTime
  for (const freq of notes) {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.32, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    osc.start(t)
    osc.stop(t + 0.4)
    t += 0.18
  }
}

function playBeep(ctx: AudioContext) {
  for (let i = 0; i < 2; i++) {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.value = 880
    const t = ctx.currentTime + i * 0.32
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.18, t + 0.01)
    gain.gain.setValueAtTime(0.18, t + 0.15)
    gain.gain.linearRampToValueAtTime(0, t + 0.2)
    osc.start(t)
    osc.stop(t + 0.2)
  }
}

function playDuck(ctx: AudioContext) {
  // Frequency sweep 580 → 180 Hz with sawtooth — classic quack shape
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(580, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.28)
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.32)
}

export function getTimerSound(): TimerSound {
  if (typeof window === 'undefined') return 'chime'
  return (localStorage.getItem(SOUND_KEY) as TimerSound) ?? 'chime'
}

export function setTimerSound(sound: TimerSound) {
  if (typeof window !== 'undefined') localStorage.setItem(SOUND_KEY, sound)
}

export async function playTimerComplete(muted = false): Promise<void> {
  if (muted) return
  const ctx = makeContext()
  if (!ctx) return
  if (ctx.state === 'suspended') await ctx.resume()
  const sound = getTimerSound()
  if (sound === 'chime') playChime(ctx)
  else if (sound === 'beep') playBeep(ctx)
  else playDuck(ctx)
  setTimeout(() => ctx.close().catch(() => {}), 2000)
}
