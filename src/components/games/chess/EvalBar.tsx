'use client';

interface EvalBarProps {
  /** Centipawn score: positive = white winning, negative = black winning */
  score: number;
  isMate: boolean;
}

const MAX_PAWNS = 10; // clamp range for the visual bar

export function EvalBar({ score, isMate }: EvalBarProps) {
  // Convert centipawns to pawns, clamped to ±MAX_PAWNS for the bar fill
  const pawns = score / 100;
  const clamped = Math.max(-MAX_PAWNS, Math.min(MAX_PAWNS, pawns));

  // White percentage: 50% at equality, 100% at +10, 0% at -10
  const whitePct = 50 + (clamped / MAX_PAWNS) * 50;
  const blackPct = 100 - whitePct;

  const label = isMate
    ? (score > 0 ? '#' : '#')
    : Math.abs(pawns) < 0.1
    ? '0.0'
    : `${pawns > 0 ? '+' : ''}${pawns.toFixed(1)}`;

  const whiteWinning = score >= 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '28px',
      gap: '6px',
    }}>
      {/* Score label — shown above for the winning side */}
      <span style={{
        fontSize: '11px',
        fontWeight: 700,
        color: 'var(--neutral-on-background-strong)',
        lineHeight: 1,
        minHeight: '14px',
        textAlign: 'center',
      }}>
        {!whiteWinning ? label : ''}
      </span>

      {/* Bar */}
      <div style={{
        width: '20px',
        flex: 1,
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.3)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}>
        {/* Black portion (top) */}
        <div style={{
          height: `${blackPct}%`,
          backgroundColor: '#1a1008',
          transition: 'height 0.4s ease',
          minHeight: '4px',
        }} />
        {/* White portion (bottom) */}
        <div style={{
          height: `${whitePct}%`,
          backgroundColor: '#f0f0f0',
          transition: 'height 0.4s ease',
          minHeight: '4px',
        }} />
      </div>

      {/* Score label — shown below for the winning side */}
      <span style={{
        fontSize: '11px',
        fontWeight: 700,
        color: 'var(--neutral-on-background-strong)',
        lineHeight: 1,
        minHeight: '14px',
        textAlign: 'center',
      }}>
        {whiteWinning ? label : ''}
      </span>
    </div>
  );
}
