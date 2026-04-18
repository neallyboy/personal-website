import { useCallback, useEffect, useRef, useState } from 'react';

type ResolveFn = (move: string | null) => void;

export function useStockfish() {
  const workerRef  = useRef<Worker | null>(null);
  const resolveRef = useRef<ResolveFn | null>(null);
  const [ready,   setReady]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    return () => { workerRef.current?.terminate(); };
  }, []);

  const initialize = useCallback(() => {
    if (workerRef.current || typeof Worker === 'undefined') return;

    setLoading(true);
    setError(false);

    const worker = new Worker('/stockfish.js');

    worker.onmessage = (e: MessageEvent) => {
      const line: string = typeof e.data === 'string' ? e.data : String(e.data);

      if (line.includes('uciok')) {
        worker.postMessage('isready');
      }

      if (line.includes('readyok')) {
        setReady(true);
        setLoading(false);
      }

      if (line.startsWith('bestmove') && resolveRef.current) {
        const move = line.split(' ')[1] ?? null;
        resolveRef.current(move === '(none)' ? null : move);
        resolveRef.current = null;
      }
    };

    worker.onerror = () => {
      setLoading(false);
      setError(true);
    };

    worker.postMessage('uci');
    workerRef.current = worker;
  }, []);

  const getBestMove = useCallback((
    fen: string,
    skillLevel: number,
    movetime: number,
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      const worker = workerRef.current;
      if (!worker || !ready) { resolve(null); return; }

      resolveRef.current = resolve;
      worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
      worker.postMessage('ucinewgame');
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage(`go movetime ${movetime}`);
    });
  }, [ready]);

  const terminate = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setReady(false);
    setLoading(false);
  }, []);

  return { ready, loading, error, initialize, terminate, getBestMove };
}
