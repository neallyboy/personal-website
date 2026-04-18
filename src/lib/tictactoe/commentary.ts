function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateGreeting(): string {
  return pick([
    "Hello! I'm Jasper. Let's play some tic-tac-toe. You won't win, but it'll be fun!",
    "Welcome! I'm Jasper, and I have never lost at this game. Good luck anyway!",
    "Ah, a challenger! I'm Jasper. Take your time — I'll be waiting.",
    "Let's play! I'm Jasper. You go first, don't be shy.",
    "Ready when you are. I'm Jasper, and I find this game quite relaxing.",
  ]);
}

export function generatePlayerMoveReaction(index: number, moveCount: number): string {
  if (moveCount === 1) {
    const corners = [0, 2, 6, 8];
    const isCenter = index === 4;
    const isCorner = corners.includes(index);
    if (isCenter) return pick([
      "The center? Classic opening. I've seen that before.",
      "Center square. Bold choice. Let me think...",
      "Going for the center, I see. Standard play.",
    ]);
    if (isCorner) return pick([
      "A corner opening. Interesting strategy.",
      "Corner play. You know what you're doing.",
      "The corner, eh? I can work with that.",
    ]);
    return pick([
      "An edge? Unconventional. I like it.",
      "The edge. Unexpected. Let me reconsider my plan.",
      "Edge square to start. You are full of surprises.",
    ]);
  }

  return pick([
    "Noted.",
    "I see your move.",
    "Interesting.",
    "Hmm. Okay.",
    "You played that quickly.",
    "Your move is on the board.",
    "Let me think about this.",
    "Alright then.",
  ]);
}

export function generateAIMoveCommentary(index: number, moveCount: number): string {
  const isCorner = [0, 2, 6, 8].includes(index);
  const isCenter = index === 4;

  if (moveCount <= 2) {
    if (isCenter) return pick([
      "I'll take the center. A classic for a reason.",
      "Center is mine. The best square on the board.",
      "The center belongs to me. This is how you play.",
    ]);
    if (isCorner) return pick([
      "I claim a corner. The opening theory is on my side.",
      "Corner for me. Let's see how you respond.",
      "I place my O in the corner. Things are going according to plan.",
    ]);
  }

  return pick([
    "There. My move.",
    "I place my O here.",
    "This should work nicely.",
    "I see my opportunity.",
    "Right there. Perfect.",
    "I like this square.",
    "My move. Your problem.",
    "Strategic placement. You'll see why soon.",
  ]);
}

export function generateWinCommentary(winner: 'X' | 'O'): string {
  if (winner === 'O') {
    return pick([
      "Three in a row! I win again. I told you.",
      "Victory! I hope you see where things went wrong.",
      "And that's the game. Well played, but I win.",
      "Got you! Three O's in a row. Better luck next time.",
      "Jasper wins! Come back anytime, I enjoy the challenge.",
    ]);
  } else {
    return pick([
      "Wait... you won?! I... I was going easy on you. Obviously.",
      "How did that happen? Congratulations, I suppose.",
      "You beat me?! Okay, that was impressive. Well done.",
      "A win for you! I must have blinked at the wrong moment.",
      "Hmm. I see you found my weakness. Well played!",
    ]);
  }
}

export function generateDrawCommentary(): string {
  return pick([
    "A draw. You played well enough to avoid losing. That's something.",
    "Neither of us wins today. I'll take the draw.",
    "It's a tie! You held your own. Respect.",
    "Draw! I was hoping for better, but you defended well.",
    "Cat's game. Come back for the rematch.",
  ]);
}

export function generateBlockCommentary(): string {
  return pick([
    "Nice try. I see what you were planning.",
    "I'll block that right now.",
    "You thought you had me. Not today.",
    "I noticed that. Blocked.",
    "Close! But not close enough.",
  ]);
}

export function generateWinningMoveCommentary(): string {
  return pick([
    "Oh, I think I see a winning move here...",
    "This ends now.",
    "You left an opening. Time to finish this.",
    "Three in a row, coming right up.",
    "Sorry, this is game over.",
  ]);
}
