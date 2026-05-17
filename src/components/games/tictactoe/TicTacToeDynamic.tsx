"use client";

import dynamic from "next/dynamic";

// Dynamically imported so the TicTacToe game logic is code-split
// from the main bundle and only loaded when the page is visited.
export const TicTacToeDynamic = dynamic(
  () => import("./TicTacToe").then((m) => ({ default: m.TicTacToe })),
  { ssr: false },
);
