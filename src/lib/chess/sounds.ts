type AudioContextType = typeof AudioContext;
declare const webkitAudioContext: AudioContextType;

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (sharedCtx && sharedCtx.state !== 'closed') return sharedCtx;
    const Ctx = typeof AudioContext !== 'undefined' ? AudioContext : webkitAudioContext;
    sharedCtx = new Ctx();
    return sharedCtx;
  } catch {
    return null;
  }
}

// Bake an exponential decay envelope directly into the noise samples.
// This makes the transient far sharper than applying a gain ramp to flat noise.
function shapedNoiseBuffer(ctx: AudioContext, duration: number, decayRate: number): AudioBuffer {
  const size = Math.floor(ctx.sampleRate * duration);
  const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (size * decayRate));
  }
  return buf;
}

/**
 * Single strike: shaped-noise through a bandpass + pitched sine that falls.
 * @param decayRate  fraction of buffer length for the noise e-fold (smaller = sharper)
 */
function strike(
  ctx: AudioContext,
  t: number,
  gain: number,
  bpHz: number,
  bpQ: number,
  toneHz: number,
  dur: number,
  decayRate = 0.12,
) {
  // --- Noise layer (transient body) ---
  const src = ctx.createBufferSource();
  src.buffer = shapedNoiseBuffer(ctx, dur, decayRate);

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = bpHz;
  bp.Q.value = bpQ;

  const ng = ctx.createGain();
  ng.gain.setValueAtTime(gain, t);

  src.connect(bp);
  bp.connect(ng);
  ng.connect(ctx.destination);
  src.start(t);
  src.stop(t + dur);

  // --- Tonal layer (pitched "body thud") ---
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(toneHz, t);
  osc.frequency.exponentialRampToValueAtTime(toneHz * 0.3, t + dur * 0.65);

  const og = ctx.createGain();
  og.gain.setValueAtTime(gain * 0.45, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.65);

  osc.connect(og);
  og.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur * 0.65);

  // --- High-frequency click (initial impact edge) ---
  const clickSize = Math.floor(ctx.sampleRate * 0.005);
  const clickBuf  = ctx.createBuffer(1, clickSize, ctx.sampleRate);
  const clickData = clickBuf.getChannelData(0);
  for (let i = 0; i < clickSize; i++) {
    clickData[i] = (Math.random() * 2 - 1) * (1 - i / clickSize);
  }

  const clickSrc = ctx.createBufferSource();
  clickSrc.buffer = clickBuf;

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 3500;

  const cg = ctx.createGain();
  cg.gain.setValueAtTime(gain * 0.55, t);

  clickSrc.connect(hp);
  hp.connect(cg);
  cg.connect(ctx.destination);
  clickSrc.start(t);
}

export function playMoveSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  // Clean, crisp "tok" — mid-bright, short
  strike(ctx, ctx.currentTime, 0.62, 980, 4.5, 440, 0.10, 0.11);
}

export function playCaptureSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const t = ctx.currentTime;
  // Heavy primary impact — lower, longer
  strike(ctx, t,        0.85, 720, 3.8, 300, 0.16, 0.13);
  // Quick secondary knock ~50ms later — brighter, softer
  strike(ctx, t + 0.05, 0.38, 1200, 5.5, 560, 0.08, 0.09);
}
