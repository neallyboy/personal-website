export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type GameStatus = 'playing' | 'win' | 'draw';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Board;
  currentTurn: Player;
  status: GameStatus;
  winner: Player | null;
  winLine: number[] | null;
  moveCount: number;
}
