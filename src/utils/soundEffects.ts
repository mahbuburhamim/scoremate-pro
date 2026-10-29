/**
 * Broadcast sound synthesizer using Web Audio API
 * Generates realistic stadium goal airhorn / whistle effects
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a stadium stadium horn / goal celebration buzzer
 */
export function playGoalSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Dual air-horn blast tones (standard stadium goal horn frequencies: ~220Hz and 330Hz)
    const tones = [220, 277.18, 329.63, 440];

    tones.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      // Pulse 1
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.setValueAtTime(0.12, now + 0.6);
      gain.gain.linearRampToValueAtTime(0, now + 0.7);

      // Pulse 2
      gain.gain.setValueAtTime(0.15, now + 0.85);
      gain.gain.setValueAtTime(0.15, now + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  } catch (e) {
    console.warn('Audio effect error:', e);
  }
}

/**
 * Play a referee whistle sound (for card / kickoff)
 */
export function playWhistleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency oscillation simulating referee whistle flutter
    osc.frequency.setValueAtTime(2800, now);
    osc.frequency.linearRampToValueAtTime(3200, now + 0.08);
    osc.frequency.linearRampToValueAtTime(2900, now + 0.25);
    osc.frequency.linearRampToValueAtTime(3100, now + 0.45);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain.gain.setValueAtTime(0.2, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {
    console.warn('Whistle audio error:', e);
  }
}
