// Web Audio API sound engine — no files, no dependencies

let _ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (_ctx && _ctx.state !== 'closed') return _ctx
  try {
    _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    return _ctx
  } catch {
    return null
  }
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.25,
  delay = 0,
) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.connect(g)
  g.connect(c.destination)
  osc.type = type
  const t = c.currentTime + delay
  osc.frequency.setValueAtTime(frequency, t)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

export const sounds = {
  /** Short tick — generic button press */
  click() {
    tone(500, 0.06, 'sine', 0.12)
  },

  /** Ascending two-note — message sent / invite sent */
  send() {
    tone(600, 0.08, 'sine', 0.18)
    tone(900, 0.12, 'sine', 0.14, 0.07)
  },

  /** Descending two-note ding — incoming message from others */
  receive() {
    tone(1100, 0.12, 'sine', 0.18)
    tone(880, 0.18, 'sine', 0.14, 0.1)
  },

  /** Three-note ascending chime — form submitted / onboarded */
  success() {
    tone(523, 0.12, 'sine', 0.22)   // C5
    tone(659, 0.12, 'sine', 0.18, 0.12) // E5
    tone(784, 0.22, 'sine', 0.2, 0.24)  // G5
  },

  /** Four-note fanfare — driver approved */
  approve() {
    tone(523, 0.1, 'sine', 0.2)
    tone(659, 0.1, 'sine', 0.18, 0.1)
    tone(784, 0.1, 'sine', 0.18, 0.2)
    tone(1046, 0.3, 'sine', 0.22, 0.3)
  },

  /** Descending buzz — error */
  error() {
    tone(300, 0.15, 'sawtooth', 0.15)
    tone(200, 0.2, 'sawtooth', 0.12, 0.12)
  },

  /** Soft pop — checkbox / theme toggle */
  toggle() {
    tone(700, 0.07, 'sine', 0.12)
    tone(950, 0.07, 'sine', 0.09, 0.05)
  },

  /** Rising sweep — splash screen complete */
  whoosh() {
    const c = getCtx()
    if (!c) return
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.connect(g)
    g.connect(c.destination)
    osc.type = 'sine'
    const t = c.currentTime
    osc.frequency.setValueAtTime(180, t)
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.35)
    g.gain.setValueAtTime(0.22, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
    osc.start(t)
    osc.stop(t + 0.5)
  },
}
