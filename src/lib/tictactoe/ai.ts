import type { Board, Difficulty } from './types';
import { checkWinner } from './logic';

function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const result = checkWinner(board);
  if (result) return result.winner === 'O' ? 10 - depth : depth - 10;
  if (board.every((c) => c !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

export function getBestMove(board: Board, difficulty: Difficulty): number {
  const available = board
    .map((cell, i) => (cell === null ? i : -1))
    .filter((i) => i !== -1);

  if (available.length === 0) return -1;

  const randomMove = available[Math.floor(Math.random() * available.length)];

  if (difficulty === 'easy' && Math.random() < 0.75) return randomMove;
  if (difficulty === 'medium' && Math.random() < 0.35) return randomMove;

  const boardCopy = [...board] as Board;
  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const i of available) {
    boardCopy[i] = 'O';
    const score = minimax(boardCopy, 0, false);
    boardCopy[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}
