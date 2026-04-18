import type { Board, Cell, GameState, Player } from './types';

export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;

export function checkWinner(board: Board): { winner: Player; winLine: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, winLine: [...line] };
    }
  }
  return null;
}

export function createInitialState(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentTurn: 'X',
    status: 'playing',
    winner: null,
    winLine: null,
    moveCount: 0,
  };
}

export function applyMove(state: GameState, index: number): GameState {
  if (state.board[index] !== null || state.status !== 'playing') return state;

  const newBoard = [...state.board] as Board;
  newBoard[index] = state.currentTurn;

  const result = checkWinner(newBoard);

  if (result) {
    return {
      board: newBoard,
      currentTurn: state.currentTurn === 'X' ? 'O' : 'X',
      status: 'win',
      winner: result.winner,
      winLine: result.winLine,
      moveCount: state.moveCount + 1,
    };
  }

  if (newBoard.every((cell: Cell) => cell !== null)) {
    return {
      board: newBoard,
      currentTurn: state.currentTurn === 'X' ? 'O' : 'X',
      status: 'draw',
      winner: null,
      winLine: null,
      moveCount: state.moveCount + 1,
    };
  }

  return {
    board: newBoard,
    currentTurn: state.currentTurn === 'X' ? 'O' : 'X',
    status: 'playing',
    winner: null,
    winLine: null,
    moveCount: state.moveCount + 1,
  };
}
