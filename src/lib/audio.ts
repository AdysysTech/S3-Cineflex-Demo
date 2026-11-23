/**
 * Pleasant Cinema Chime synthesizer using standard Web Audio API.
 * Requires zero external audio files, works completely offline, and
 * bypasses asset loading errors.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playOrderChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic bell sequence: F5 (698.46 Hz) -> A5 (880.00 Hz) -> C6 (1046.50 Hz) -> F6 (1396.91 Hz)
    const notes = [
      { freq: 698.46, time: 0.0, dur: 0.8 },
      { freq: 880.00, time: 0.12, dur: 0.9 },
      { freq: 1046.50, time: 0.24, dur: 1.2 },
      { freq: 1396.91, time: 0.36, dur: 1.6 },
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + time);

      // Smooth attack and pleasant exponential cinema bell decay
      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.exponentialRampToValueAtTime(0.28, now + time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (err) {
    console.warn("Could not play audio notification chime:", err);
  }
}

export function unlockAudio(): void {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
  } catch (e) {
    console.warn("Audio unlock error:", e);
  }
}
