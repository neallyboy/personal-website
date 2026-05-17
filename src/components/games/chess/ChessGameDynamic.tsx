"use client";

import dynamic from "next/dynamic";

// Dynamically imported so the chess engine and board logic are code-split
// from the main bundle and only loaded when the chess page is visited.
export const ChessGameDynamic = dynamic(
  () => import("./ChessGame").then((m) => ({ default: m.ChessGame })),
  { ssr: false },
);
