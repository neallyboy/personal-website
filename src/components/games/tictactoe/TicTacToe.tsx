"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getBestMove } from "@/lib/tictactoe/ai";
import {
  generateAIMoveCommentary,
  generateBlockCommentary,
  generateDrawCommentary,
  generateGreeting,
  generatePlayerMoveReaction,
  generateWinCommentary,
  generateWinningMoveCommentary,
} from "@/lib/tictactoe/commentary";
import {
  applyMove,
  checkWinner,
  createInitialState,
} from "@/lib/tictactoe/logic";
import { playDrawSound, playOSound, playWinSound, playXSound } from "@/lib/tictactoe/sounds";
import type { Difficulty, GameState } from "@/lib/tictactoe/types";
import { useSpeech } from "@/hooks/useSpeech";
import styles from "./TicTacToe.module.scss";

const DIFFICULTIES: { label: string; value: Difficulty }[] = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

interface ChatMessage {
  id: number;
  text: string;
}

function btnStyle(active: boolean): React.CSSProperties {
  return {
    padding: "6px 14px",
    borderRadius: "6px",
    border: active
      ? "1px solid var(--brand-border-strong)"
      : "1px solid var(--neutral-alpha-medium)",
    background: active
      ? "var(--brand-background-medium)"
      : "var(--neutral-background)",
    color: active
      ? "var(--brand-on-background-strong)"
      : "var(--neutral-on-background-weak)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: active ? 700 : 500,
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  };
}

function detectCommentaryType(
  board: Parameters<typeof getBestMove>[0],
  moveIndex: number,
): "block" | "win" | "normal" {
  // Check if AI is winning with this move
  const testWin = [...board];
  testWin[moveIndex] = "O";
  if (checkWinner(testWin as typeof board)) return "win";

  // Check if AI is blocking a player win
  const testBlock = [...board];
  testBlock[moveIndex] = "X";
  if (checkWinner(testBlock as typeof board)) return "block";

  return "normal";
}

export function TicTacToe() {
  const [game, setGame] = useState<GameState>(createInitialState);
  const [thinking, setThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameRef = useRef(game);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);
  gameRef.current = game;

  const { speak, muted, toggleMute } = useSpeech();

  const addMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: ++msgIdRef.current, text }]);
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }, []);

  const say = useCallback(
    (text: string) => {
      speak(text);
      addMessage(text);
    },
    [speak, addMessage],
  );

  // Greeting on mount
  useEffect(() => {
    const g = generateGreeting();
    addMessage(g);
    speak(g);
  }, [addMessage, speak]);

  // AI move trigger
  useEffect(() => {
    if (game.currentTurn !== "O") return;
    if (game.status !== "playing") return;

    setThinking(true);

    aiTimer.current = setTimeout(() => {
      const current = gameRef.current;
      if (current.currentTurn !== "O" || current.status !== "playing") {
        setThinking(false);
        return;
      }

      const moveIndex = getBestMove(current.board, difficulty);
      if (moveIndex === -1) {
        setThinking(false);
        return;
      }

      const commentType = detectCommentaryType(current.board, moveIndex);
      const next = applyMove(current, moveIndex);

      playOSound();
      setGame(next);
      setThinking(false);

      let text: string;
      if (next.status === "win" && next.winner === "O") {
        text = generateWinCommentary("O");
        setTimeout(() => playWinSound(), 300);
      } else if (next.status === "draw") {
        text = generateDrawCommentary();
        setTimeout(() => playDrawSound(), 300);
      } else if (commentType === "win") {
        text = generateWinningMoveCommentary();
      } else if (commentType === "block") {
        text = generateBlockCommentary();
      } else {
        text = generateAIMoveCommentary(moveIndex, current.moveCount);
      }

      setTimeout(() => say(text), 200);
    }, 500);

    return () => {
      if (aiTimer.current) clearTimeout(aiTimer.current);
    };
  }, [game.currentTurn, game.status, difficulty, say]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCellClick = useCallback(
    (index: number) => {
      if (
        game.currentTurn !== "X" ||
        game.status !== "playing" ||
        game.board[index] !== null ||
        thinking
      )
        return;

      playXSound();
      const next = applyMove(game, index);
      setGame(next);

      if (next.status === "win" && next.winner === "X") {
        const text = generateWinCommentary("X");
        setTimeout(() => {
          say(text);
          playWinSound();
        }, 300);
      } else if (next.status === "draw") {
        const text = generateDrawCommentary();
        setTimeout(() => {
          say(text);
          playDrawSound();
        }, 300);
      } else {
        const reaction = generatePlayerMoveReaction(index, game.moveCount);
        setTimeout(() => say(reaction), 200);
      }
    },
    [game, thinking, say],
  );

  const reset = useCallback(
    (newDifficulty?: Difficulty) => {
      if (aiTimer.current) clearTimeout(aiTimer.current);
      setGame(createInitialState());
      setThinking(false);
      setMessages([]);
      if (newDifficulty) setDifficulty(newDifficulty);
      const g = generateGreeting();
      addMessage(g);
      speak(g);
    },
    [addMessage, speak],
  );

  const statusText = () => {
    if (thinking) return "Jasper is thinking…";
    switch (game.status) {
      case "win":
        return game.winner === "X" ? "You win!" : "Jasper wins!";
      case "draw":
        return "It's a draw!";
      default:
        return game.currentTurn === "X" ? "Your turn (X)" : "Jasper's turn (O)";
    }
  };

  const winSet = new Set(game.winLine ?? []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        width: "100%",
      }}
    >
      {/* Difficulty selector */}
      <div style={{ display: "flex", gap: "8px" }}>
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            type="button"
            style={btnStyle(difficulty === d.value)}
            onClick={() => reset(d.value)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--neutral-on-background-strong)",
          minHeight: "22px",
          letterSpacing: "0.01em",
        }}
      >
        {statusText()}
      </div>

      {/* Board + Chat */}
      <div className={styles.gameRow}>
        <div className={styles.boardSection}>
          <div className={styles.boardWrap}>
            <div className={styles.board}>
              {game.board.map((cell, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ""}`}
                  className={`${styles.cell}${winSet.has(i) ? ` ${styles.win}` : ""}${cell === "X" ? ` ${styles.cellX}` : ""}${cell === "O" ? ` ${styles.cellO}` : ""}`}
                  onClick={() => handleCellClick(i)}
                  disabled={
                    cell !== null ||
                    game.status !== "playing" ||
                    game.currentTurn !== "X" ||
                    thinking
                  }
                >
                  {cell}
                </button>
              ))}
            </div>

            {game.status !== "playing" && (
              <div className={styles.overlay}>
                <div className={styles.overlayTitle}>
                  {game.status === "win"
                    ? game.winner === "X"
                      ? "You Win!"
                      : "Jasper Wins!"
                    : "Draw!"}
                </div>
                <div className={styles.overlaySubtitle}>
                  {game.status === "win"
                    ? game.winner === "X"
                      ? "Well played!"
                      : "Better luck next time"
                    : "Cat's game"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Jasper's chat panel */}
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>Jasper says</div>
          <div className={styles.chatMessages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    lineHeight: 1,
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  ⭕
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.55,
                    color: "var(--neutral-on-background-strong)",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "8px 28px",
            borderRadius: "8px",
            border: "1px solid var(--neutral-alpha-medium)",
            background: "var(--neutral-background)",
            color: "var(--neutral-on-background-strong)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          New Game
        </button>
        <button
          type="button"
          onClick={toggleMute}
          title={muted ? "Unmute Jasper" : "Mute Jasper"}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid var(--neutral-alpha-medium)",
            background: "var(--neutral-background)",
            color: "var(--neutral-on-background-strong)",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}
