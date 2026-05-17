"use client";

import dynamic from "next/dynamic";

// Dynamically imported to code-split the game logic from the main bundle.
// SSR is kept enabled so that:
// 1. The initial HTML includes game content (Playwright tests can read it immediately)
// 2. useSpeech mounts during hydration, so the first user click unlocks voiceover correctly
export const TicTacToeDynamic = dynamic(
  () => import("./TicTacToe").then((m) => ({ default: m.TicTacToe })),
);
