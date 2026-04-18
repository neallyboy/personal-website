import type { Board, Color, GameState, Move, PieceType, Position } from './types';

// Row 0 = rank 8 (black's back rank), Row 7 = rank 1 (white's back rank)
// White pieces move toward row 0, black pieces move toward row 7

export function createInitialBoard(): Board {
  const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  const backRank: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

  for (let col = 0; col < 8; col++) {
    b[0][col] = { type: backRank[col], color: 'b' };
    b[1][col] = { type: 'P', color: 'b' };
    b[6][col] = { type: 'P', color: 'w' };
    b[7][col] = { type: backRank[col], color: 'w' };
  }

  return b;
}

export function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    turn: 'w',
    castling: {
      w: { kingside: true, queenside: true },
      b: { kingside: true, queenside: true },
    },
    enPassantTarget: null,
    lastMove: null,
    status: 'playing',
    inCheck: false,
  };
}

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function findKing(board: Board, color: Color): Position {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = board[row][col];
      if (p && p.type === 'K' && p.color === color) return { row, col };
    }
  }
  throw new Error(`King not found for ${color}`);
}

export function isSquareAttackedBy(board: Board, pos: Position, byColor: Color): boolean {
  const { row, col } = pos;

  // Pawn attacks: white pawns attack upward (lower row index), black downward
  // A pawn of byColor attacks pos if it sits at the appropriate diagonal
  const pawnRow = row + (byColor === 'w' ? 1 : -1);
  for (const dc of [-1, 1]) {
    if (inBounds(pawnRow, col + dc)) {
      const p = board[pawnRow][col + dc];
      if (p && p.type === 'P' && p.color === byColor) return true;
    }
  }

  // Knight attacks
  for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
    const r = row + dr, c = col + dc;
    if (inBounds(r, c)) {
      const p = board[r][c];
      if (p && p.type === 'N' && p.color === byColor) return true;
    }
  }

  // Diagonal sliders (bishop, queen)
  for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
    let r = row + dr, c = col + dc;
    while (inBounds(r, c)) {
      const p = board[r][c];
      if (p) {
        if (p.color === byColor && (p.type === 'B' || p.type === 'Q')) return true;
        break;
      }
      r += dr; c += dc;
    }
  }

  // Straight sliders (rook, queen)
  for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    let r = row + dr, c = col + dc;
    while (inBounds(r, c)) {
      const p = board[r][c];
      if (p) {
        if (p.color === byColor && (p.type === 'R' || p.type === 'Q')) return true;
        break;
      }
      r += dr; c += dc;
    }
  }

  // King attacks (prevents kings from walking adjacent)
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr, c = col + dc;
      if (inBounds(r, c)) {
        const p = board[r][c];
        if (p && p.type === 'K' && p.color === byColor) return true;
      }
    }
  }

  return false;
}

export function isInCheck(board: Board, color: Color): boolean {
  const kingPos = findKing(board, color);
  return isSquareAttackedBy(board, kingPos, color === 'w' ? 'b' : 'w');
}

function getPseudoLegalMoves(state: GameState, pos: Position): Move[] {
  const { board, castling, enPassantTarget } = state;
  const piece = board[pos.row][pos.col];
  if (!piece || piece.color !== state.turn) return [];

  const moves: Move[] = [];
  const { row, col } = pos;
  const { color } = piece;
  const opp = color === 'w' ? 'b' : 'w';

  const add = (toRow: number, toCol: number, extra?: Partial<Move>) =>
    moves.push({ from: pos, to: { row: toRow, col: toCol }, ...extra });

  switch (piece.type) {
    case 'P': {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      const promoRow = color === 'w' ? 0 : 7;

      if (inBounds(row + dir, col) && !board[row + dir][col]) {
        if (row + dir === promoRow) {
          for (const pt of ['Q', 'R', 'B', 'N'] as PieceType[]) add(row + dir, col, { promotion: pt });
        } else {
          add(row + dir, col);
          if (row === startRow && !board[row + 2 * dir][col]) add(row + 2 * dir, col);
        }
      }

      for (const dc of [-1, 1]) {
        const tr = row + dir, tc = col + dc;
        if (!inBounds(tr, tc)) continue;
        const target = board[tr][tc];
        if (target && target.color === opp) {
          if (tr === promoRow) {
            for (const pt of ['Q', 'R', 'B', 'N'] as PieceType[]) add(tr, tc, { promotion: pt });
          } else {
            add(tr, tc);
          }
        } else if (enPassantTarget && enPassantTarget.row === tr && enPassantTarget.col === tc) {
          add(tr, tc, { enPassant: true });
        }
      }
      break;
    }

    case 'N': {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        const r = row + dr, c = col + dc;
        if (inBounds(r, c) && board[r][c]?.color !== color) add(r, c);
      }
      break;
    }

    case 'B':
    case 'R':
    case 'Q': {
      const dirs: [number, number][] =
        piece.type === 'B' ? [[-1,-1],[-1,1],[1,-1],[1,1]]
        : piece.type === 'R' ? [[-1,0],[1,0],[0,-1],[0,1]]
        : [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) {
        let r = row + dr, c = col + dc;
        while (inBounds(r, c)) {
          const t = board[r][c];
          if (t) { if (t.color !== color) add(r, c); break; }
          add(r, c);
          r += dr; c += dc;
        }
      }
      break;
    }

    case 'K': {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = row + dr, c = col + dc;
          if (inBounds(r, c) && board[r][c]?.color !== color) add(r, c);
        }
      }
      const backRow = color === 'w' ? 7 : 0;
      if (row === backRow && col === 4) {
        if (castling[color].kingside && !board[backRow][5] && !board[backRow][6]) {
          const rook = board[backRow][7];
          if (rook && rook.type === 'R' && rook.color === color) add(backRow, 6, { castle: 'kingside' });
        }
        if (castling[color].queenside && !board[backRow][3] && !board[backRow][2] && !board[backRow][1]) {
          const rook = board[backRow][0];
          if (rook && rook.type === 'R' && rook.color === color) add(backRow, 2, { castle: 'queenside' });
        }
      }
      break;
    }
  }

  return moves;
}

export function applyMoveToBoard(board: Board, move: Move): Board {
  const b: Board = board.map(row => [...row]);
  const piece = b[move.from.row][move.from.col]!;
  b[move.from.row][move.from.col] = null;

  if (move.castle) {
    const backRow = move.to.row;
    b[backRow][move.to.col] = piece;
    if (move.castle === 'kingside') {
      b[backRow][5] = b[backRow][7];
      b[backRow][7] = null;
    } else {
      b[backRow][3] = b[backRow][0];
      b[backRow][0] = null;
    }
  } else if (move.enPassant) {
    b[move.to.row][move.to.col] = piece;
    const captureRow = piece.color === 'w' ? move.to.row + 1 : move.to.row - 1;
    b[captureRow][move.to.col] = null;
  } else {
    b[move.to.row][move.to.col] = move.promotion
      ? { type: move.promotion, color: piece.color }
      : piece;
  }

  return b;
}

export function getLegalMoves(state: GameState, pos: Position): Move[] {
  const piece = state.board[pos.row][pos.col];
  if (!piece) return [];
  const color = piece.color;

  return getPseudoLegalMoves(state, pos).filter(move => {
    if (move.castle) {
      if (isInCheck(state.board, color)) return false;
      const passCol = move.castle === 'kingside' ? 5 : 3;
      const midBoard = applyMoveToBoard(state.board, { from: pos, to: { row: move.to.row, col: passCol } });
      if (isInCheck(midBoard, color)) return false;
    }
    const newBoard = applyMoveToBoard(state.board, move);
    return !isInCheck(newBoard, color);
  });
}

export function getAllLegalMoves(state: GameState): Move[] {
  const moves: Move[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = state.board[row][col];
      if (p && p.color === state.turn) moves.push(...getLegalMoves(state, { row, col }));
    }
  }
  return moves;
}

export function applyMove(state: GameState, move: Move): GameState {
  const newBoard = applyMoveToBoard(state.board, move);
  const piece = state.board[move.from.row][move.from.col]!;

  const newCastling = { w: { ...state.castling.w }, b: { ...state.castling.b } };
  if (piece.type === 'K') newCastling[piece.color] = { kingside: false, queenside: false };
  if (piece.type === 'R') {
    if (move.from.col === 0) newCastling[piece.color].queenside = false;
    if (move.from.col === 7) newCastling[piece.color].kingside = false;
  }
  // Rook capture removes castling rights
  if (move.to.row === 7 && move.to.col === 0) newCastling.w.queenside = false;
  if (move.to.row === 7 && move.to.col === 7) newCastling.w.kingside = false;
  if (move.to.row === 0 && move.to.col === 0) newCastling.b.queenside = false;
  if (move.to.row === 0 && move.to.col === 7) newCastling.b.kingside = false;

  let newEnPassant: Position | null = null;
  if (piece.type === 'P' && Math.abs(move.to.row - move.from.row) === 2) {
    newEnPassant = { row: (move.from.row + move.to.row) / 2, col: move.from.col };
  }

  const nextTurn = state.turn === 'w' ? 'b' : 'w';
  const newState: GameState = {
    board: newBoard,
    turn: nextTurn,
    castling: newCastling,
    enPassantTarget: newEnPassant,
    lastMove: move,
    status: 'playing',
    inCheck: false,
  };

  const inCheck = isInCheck(newBoard, nextTurn);
  const hasLegalMoves = getAllLegalMoves(newState).length > 0;

  newState.inCheck = inCheck;
  if (!hasLegalMoves) {
    newState.status = inCheck ? 'checkmate' : 'stalemate';
  } else if (inCheck) {
    newState.status = 'check';
  }

  return newState;
}
