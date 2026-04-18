export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type Color = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: Color;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  promotion?: PieceType;
  enPassant?: boolean;
  castle?: 'kingside' | 'queenside';
}

export interface CastlingRights {
  kingside: boolean;
  queenside: boolean;
}

export interface GameState {
  board: Board;
  turn: Color;
  castling: { w: CastlingRights; b: CastlingRights };
  enPassantTarget: Position | null;
  lastMove: Move | null;
  status: 'playing' | 'check' | 'checkmate' | 'stalemate';
  inCheck: boolean;
}
