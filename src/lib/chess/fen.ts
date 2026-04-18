import type { GameState, Move, PieceType, Position } from './types';

export function toFen(state: GameState): string {
  let placement = '';
  for (let row = 0; row < 8; row++) {
    let empty = 0;
    for (let col = 0; col < 8; col++) {
      const piece = state.board[row][col];
      if (!piece) {
        empty++;
      } else {
        if (empty > 0) { placement += empty; empty = 0; }
        placement += piece.color === 'w' ? piece.type : piece.type.toLowerCase();
      }
    }
    if (empty > 0) placement += empty;
    if (row < 7) placement += '/';
  }

  let castling = '';
  if (state.castling.w.kingside)  castling += 'K';
  if (state.castling.w.queenside) castling += 'Q';
  if (state.castling.b.kingside)  castling += 'k';
  if (state.castling.b.queenside) castling += 'q';
  if (!castling) castling = '-';

  let ep = '-';
  if (state.enPassantTarget) {
    ep = String.fromCharCode(97 + state.enPassantTarget.col) + (8 - state.enPassantTarget.row);
  }

  return `${placement} ${state.turn} ${castling} ${ep} 0 1`;
}

function algToPos(sq: string): Position {
  return { col: sq.charCodeAt(0) - 97, row: 8 - parseInt(sq[1]) };
}

export function parseBestMove(moveStr: string, legalMoves: Move[]): Move | null {
  if (!moveStr || moveStr === '(none)') return null;

  const from  = algToPos(moveStr.slice(0, 2));
  const to    = algToPos(moveStr.slice(2, 4));
  const promo = moveStr.length >= 5 ? (moveStr[4].toUpperCase() as PieceType) : undefined;

  return legalMoves.find(m =>
    m.from.row === from.row && m.from.col === from.col &&
    m.to.row   === to.row   && m.to.col   === to.col   &&
    (!promo || m.promotion === promo)
  ) ?? null;
}
