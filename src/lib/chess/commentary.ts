import type { PieceType } from './types';

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const PIECE_NAMES: Record<PieceType, string> = {
  K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn',
};

export function generateAIMoveCommentary(opts: {
  piece: PieceType;
  isCapture: boolean;
  capturedPiece: PieceType | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isCastle: boolean;
  isPromotion: boolean;
  evalScore: number; // positive = AI winning
}): string {
  const { piece, isCapture, capturedPiece, isCheck, isCheckmate, isCastle, isPromotion, evalScore } = opts;

  if (isCheckmate) return pick([
    'Checkmate. Well played, but the game is mine.',
    'Checkmate! That was a good fight.',
    'Checkmate. I hope you will give me a rematch.',
    'And that is checkmate. You pushed me hard.',
  ]);

  if (isCheck) return pick([
    'Check! Your king is in danger.',
    'Check. You will need to deal with that.',
    'Check. Your king must move.',
    'I give check. Your move.',
    'Check! Watch out.',
  ]);

  if (isCastle) return pick([
    'I castle. Safety first.',
    'Tucking my king away safely.',
    'Time to castle. Better safe than sorry.',
    'Getting my king to safety.',
  ]);

  if (isPromotion) return pick([
    'Promotion! My pawn becomes a queen.',
    'My pawn has earned its promotion.',
    'New queen on the board. This changes things.',
    'Pawn to queen. Things are looking up for me.',
  ]);

  if (isCapture && capturedPiece) {
    const name = PIECE_NAMES[capturedPiece];
    if (capturedPiece === 'Q') return pick([
      'Your queen falls. The endgame is mine.',
      'I take your queen. The tide has turned.',
      'Goodbye to your queen.',
    ]);
    if (capturedPiece === 'R') return pick([
      `I take your rook. Material advantage mine.`,
      `That rook is coming off the board.`,
      `Your rook is mine now.`,
    ]);
    return pick([
      `I take your ${name}.`,
      `Capturing your ${name}.`,
      `Your ${name} is mine.`,
      `I will take that ${name}, thank you.`,
    ]);
  }

  const winComment  = evalScore >  300 ? pick([' The position is clearly mine.', ' I like this position.', '']) : '';
  const loseComment = evalScore < -300 ? pick([' You are playing really well.', ' You have the better game here.', '']) : '';
  const ctx = winComment || loseComment;

  switch (piece) {
    case 'P': return pick([
      'I advance my pawn.',
      'My pawn moves forward.',
      `Pushing a pawn.${ctx}`,
      'I develop with a pawn move.',
      'Pawn forward.',
    ]);
    case 'N': return pick([
      'My knight hops into position.',
      'The knight springs forward.',
      `I reposition my knight.${ctx}`,
      'Knight move. Let us see what you do with that.',
    ]);
    case 'B': return pick([
      'My bishop eyes your position.',
      'I slide my bishop across the board.',
      `The bishop enters the game.${ctx}`,
      'Diagonal pressure from my bishop.',
    ]);
    case 'R': return pick([
      'My rook takes the open file.',
      'I swing my rook over.',
      `The rook joins the fight.${ctx}`,
      'Rook to the active square.',
    ]);
    case 'Q': return pick([
      'My queen enters the action.',
      'I bring my queen to bear.',
      `The queen moves. Carefully now.${ctx}`,
      'Queen on the attack.',
    ]);
    case 'K': return pick([
      'My king finds a safer square.',
      'I tuck my king away.',
      `King safety is important.${ctx}`,
    ]);
  }
}

export function generatePlayerMoveReaction(opts: {
  capturedPiece: PieceType | null;
  isCheck: boolean;
  evalDiff: number; // positive = player improved position
}): string {
  const { capturedPiece, isCheck, evalDiff } = opts;

  if (isCheck) return pick([
    'Check on me? Let me find a way out.',
    'You give check. I will deal with that.',
    'Ah, check. Nicely spotted.',
    'Check! Good move. I need to respond carefully.',
  ]);

  if (capturedPiece) {
    const name = PIECE_NAMES[capturedPiece];
    if (capturedPiece === 'Q') return pick([
      'You took my queen! Well played.',
      'My queen is gone. This is getting serious.',
      'There goes my queen. You played that well.',
    ]);
    return pick([
      `You took my ${name}. Fair enough.`,
      `There goes my ${name}.`,
      `My ${name} is off the board.`,
      `You captured my ${name}. I will find compensation.`,
    ]);
  }

  if (evalDiff > 150) return pick([
    'That is a strong move.',
    'Nicely played.',
    'Good move. I need to think carefully.',
    'You are putting pressure on me.',
    'Well played. I respect that.',
  ]);

  if (evalDiff < -150) return pick([
    'Interesting choice.',
    'I think I can work with that.',
    'That might give me an opportunity.',
    'Hmm. Let me show you what I have in mind.',
  ]);

  return pick([
    'I see your move.',
    'Interesting.',
    'Let me think.',
    'Noted. Now for my response.',
    'Your move is on the board.',
  ]);
}

export function generateGameEndCommentary(result: 'player_wins' | 'stalemate'): string {
  if (result === 'player_wins') return pick([
    'Well played. You earned that win.',
    'Checkmate. Congratulations, you outplayed me.',
    'A deserved victory. Well done.',
    'You got me. Good game!',
    'I have no moves. You win. Well played.',
  ]);
  return pick([
    'Stalemate. A draw. Interesting finish.',
    'We have reached a stalemate. Neither of us wins today.',
    'A draw by stalemate. I will take it.',
  ]);
}

export function generateGreeting(): string {
  return pick([
    'Good luck. You will need it.',
    'Welcome to the board. May the best player win.',
    'A new game begins. I am ready when you are.',
    'Let us play. I will not hold back.',
    'The board is set. Your move first.',
  ]);
}
