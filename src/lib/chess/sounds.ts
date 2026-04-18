type AudioContextType = typeof AudioContext;
declare const webkitAudioContext: AudioContextType;

function getAudioContext(): AudioContext | null {
  try {
    const Ctx = typeof AudioContext !== 'undefined' ? AudioContext : webkitAudioContext;
    return new Ctx();
  } catch {
    return null;
  }
}

export function playMoveSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Soft wooden click: short sine burst with fast decay
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1100, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.06);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.07);
  osc.onended = () => ctx.close();
}

export function playCaptureSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Heavier impact: layered oscillators with a lower thud
  const pairs: [number, OscillatorType][] = [
    [520, 'sawtooth'],
    [260, 'sine'],
  ];

  for (const [freq, type] of pairs) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.25, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.14);
  }

  setTimeout(() => ctx.close(), 300);
}
