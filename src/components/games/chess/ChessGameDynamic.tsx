"use client";

import dynamic from "next/dynamic";

// Dynamically imported to code-split the chess engine and board logic from
// the main bundle. SSR is kept enabled so that:
// 1. The initial HTML includes game content (Playwright tests can read it immediately)
// 2. useSpeech mounts during hydration, so the first user click unlocks voiceover correctly
export const ChessGameDynamic = dynamic(
  () => import("./ChessGame").then((m) => ({ default: m.ChessGame })),
);
