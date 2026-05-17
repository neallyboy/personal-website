import type { GameState, Move } from './types';
import { applyMove, getAllLegalMoves } from './logic';

const PIECE_VALUES: Record<string, number> = {
  P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000,
};

// Positional bonus tables — indexed [row][col], white's perspective (row 7 = rank 1)
const TABLES: Record<string, number[][]> = {
  P: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
  ],
  N: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50],
  ],
  B: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20],
  ],
  R: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 0,  0,  0,  5,  5,  0,  0,  0],
  ],
  Q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20],
  ],
  K: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20],
  ],
};

function posBonus(type: string, row: number, col: number, color: 'w' | 'b'): number {
  const table = TABLES[type];
  if (!table) return 0;
  const r = color === 'w' ? row : 7 - row;
  return table[r][col];
}

/** Compact string key for a board position — used by the transposition table. */
function boardKey(state: GameState): string {
  let key = state.turn;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c];
      key += p ? `${p.color}${p.type}` : '.';
    }
  }
  return key;
}

export function evaluatePosition(state: GameState): number {
  if (state.status === 'checkmate') return state.turn === 'w' ? -100000 : 100000;
  if (state.status === 'stalemate') return 0;

  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = state.board[row][col];
      if (!p) continue;
      const val = PIECE_VALUES[p.type] + posBonus(p.type, row, col, p.color);
      score += p.color === 'w' ? val : -val;
    }
  }
  return score;
}

/**
 * Alpha-beta minimax with a per-search transposition table.
 * The table is created fresh in getBestMove so it doesn't persist stale
 * evaluations across different game states.
 */
function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  table: Map<string, number>,
): number {
  if (depth === 0 || state.status === 'checkmate' || state.status === 'stalemate') {
    return evaluatePosition(state);
  }

  const key = boardKey(state);
  if (table.has(key)) return table.get(key)!;

  const moves = getAllLegalMoves(state);
  let result: number;

  if (maximizing) {
    let best = -Infinity;
    for (const move of moves) {
      best = Math.max(best, minimax(applyMove(state, move), depth - 1, alpha, beta, false, table));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    result = best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      best = Math.min(best, minimax(applyMove(state, move), depth - 1, alpha, beta, true, table));
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    result = best;
  }

  table.set(key, result);
  return result;
}

export function getBestMove(state: GameState, depth = 3): Move | null {
  const moves = getAllLegalMoves(state);
  if (moves.length === 0) return null;

  // Fresh transposition table per search — avoids stale cross-move cache entries
  const table = new Map<string, number>();

  const maximizing = state.turn === 'w';
  let bestMove = moves[0];
  let bestScore = maximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const score = minimax(applyMove(state, move), depth - 1, -Infinity, Infinity, !maximizing, table);
    if (maximizing ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
