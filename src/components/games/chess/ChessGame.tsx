"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { evaluatePosition, getBestMove } from "@/lib/chess/ai";
import {
  generateAIMoveCommentary,
  generateGameEndCommentary,
  generateGreeting,
  generatePlayerMoveReaction,
} from "@/lib/chess/commentary";
import { parseBestMove, toFen } from "@/lib/chess/fen";
import {
  applyMove,
  createInitialState,
  getAllLegalMoves,
  getLegalMoves,
} from "@/lib/chess/logic";
import { playCaptureSound, playMoveSound } from "@/lib/chess/sounds";
import type { GameState, Move, Position } from "@/lib/chess/types";
import { useStockfish } from "@/hooks/useStockfish";
import { useSpeech } from "@/hooks/useSpeech";
import { EvalBar } from "./EvalBar";
import styles from "./ChessGame.module.scss";

const SYMBOLS: Record<string, string> = {
  wK: "♚",
  wQ: "♛",
  wR: "♜",
  wB: "♝",
  wN: "♞",
  wP: "♟",
  bK: "♚",
  bQ: "♛",
  bR: "♜",
  bB: "♝",
  bN: "♞",
  bP: "♟",
};

const LIGHT = "#f0d9b5";
const DARK = "#b58863";
const SEL = "rgba(20, 85, 30, 0.55)";
const MOVED = "rgba(155, 199, 0, 0.41)";
const CHECK = "rgba(220, 40, 40, 0.6)";
const DOT = "rgba(0, 0, 0, 0.18)";
const RING = "rgba(0, 0, 0, 0.22)";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const ROWS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

const DIFFICULTIES = [
  { label: "Beginner", skill: 1, movetime: 50 },
  { label: "Casual", skill: 5, movetime: 150 },
  { label: "Intermediate", skill: 10, movetime: 500 },
  { label: "Advanced", skill: 15, movetime: 1000 },
  { label: "Master", skill: 20, movetime: 2500 },
] as const;

type Engine = "minimax" | "stockfish";

interface ChatMessage {
  id: number;
  text: string;
}

function isCapture(g: GameState, move: Move): boolean {
  return !!g.board[move.to.row][move.to.col] || !!move.enPassant;
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

export function ChessGame() {
  const [game, setGame] = useState<GameState>(createInitialState);
  const [selected, setSelected] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [thinking, setThinking] = useState(false);
  const [evalScore, setEvalScore] = useState(0);
  const [engine, setEngine] = useState<Engine>("minimax");
  const [diffIdx, setDiffIdx] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameRef = useRef(game);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);
  gameRef.current = game;

  const sf = useStockfish();
  const { initialize: sfInit, getBestMove: sfGet } = sf;
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

  // Greeting on mount — stable refs mean this only fires once
  useEffect(() => {
    const g = generateGreeting();
    addMessage(g);
    speak(g);
  }, [addMessage, speak]);

  // Init Stockfish when selected
  useEffect(() => {
    if (engine === "stockfish") sfInit();
  }, [engine, sfInit]);

  // AI move trigger
  useEffect(() => {
    if (game.turn !== "b") return;
    if (game.status !== "playing" && game.status !== "check") return;

    setThinking(true);

    const runAI = (g: GameState) => {
      const evalBefore = evaluatePosition(g);

      const afterMove = (move: Move) => {
        isCapture(g, move) ? playCaptureSound() : playMoveSound();
        const next = applyMove(g, move);
        const evalAfter = evaluatePosition(next);
        setGame(next);
        setEvalScore(evalAfter);

        const piece = g.board[move.from.row][move.from.col];
        if (!piece) return;
        const captured = g.board[move.to.row][move.to.col];

        let text: string;
        if (next.status === "checkmate") {
          text = generateAIMoveCommentary({
            piece: piece.type,
            isCapture: false,
            capturedPiece: null,
            isCheck: false,
            isCheckmate: true,
            isCastle: false,
            isPromotion: false,
            evalScore: evalAfter,
          });
        } else if (next.status === "stalemate") {
          text = generateGameEndCommentary("stalemate");
        } else {
          text = generateAIMoveCommentary({
            piece: piece.type,
            isCapture: isCapture(g, move),
            capturedPiece: captured?.type ?? null,
            isCheck: next.inCheck,
            isCheckmate: false,
            isCastle: !!move.castle,
            isPromotion: !!move.promotion,
            evalScore: evalAfter - evalBefore,
          });
        }
        say(text);
        setThinking(false);
      };

      if (engine === "minimax") {
        aiTimer.current = setTimeout(() => {
          const move = getBestMove(gameRef.current, 3);
          if (move) afterMove(move);
          else setThinking(false);
        }, 350);
      } else {
        if (!sf.ready) {
          setThinking(false);
          return;
        }
        const diff = DIFFICULTIES[diffIdx];
        sfGet(toFen(g), diff.skill, diff.movetime).then((moveStr) => {
          const current = gameRef.current;
          const move = moveStr
            ? parseBestMove(moveStr, getAllLegalMoves(current))
            : null;
          if (move) afterMove(move);
          else setThinking(false);
        });
      }
    };

    runAI(gameRef.current);
    return () => {
      if (aiTimer.current) clearTimeout(aiTimer.current);
    };
  }, [game.turn, game.status, engine, sf.ready, diffIdx, say, sfGet]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (
        game.turn !== "w" ||
        game.status === "checkmate" ||
        game.status === "stalemate" ||
        thinking
      )
        return;

      const piece = game.board[row][col];

      if (selected) {
        const move = legalMoves.find(
          (m) =>
            m.to.row === row &&
            m.to.col === col &&
            (!m.promotion || m.promotion === "Q"),
        );
        if (move) {
          const evalBefore = evaluatePosition(game);
          isCapture(game, move) ? playCaptureSound() : playMoveSound();
          const next = applyMove(game, move);
          const evalAfter = evaluatePosition(next);
          setGame(next);
          setEvalScore(evalAfter);
          setSelected(null);
          setLegalMoves([]);

          // Check if player just won or stalemated
          if (next.status === "checkmate") {
            setTimeout(
              () => say(generateGameEndCommentary("player_wins")),
              400,
            );
          } else if (next.status === "stalemate") {
            setTimeout(() => say(generateGameEndCommentary("stalemate")), 400);
          } else {
            const captured = game.board[move.to.row][move.to.col];
            setTimeout(
              () =>
                say(
                  generatePlayerMoveReaction({
                    capturedPiece: captured?.type ?? null,
                    isCheck: next.inCheck,
                    evalDiff: evalBefore - evalAfter,
                  }),
                ),
              400,
            );
          }
          return;
        }
        if (piece && piece.color === "w") {
          const pos = { row, col };
          setSelected(pos);
          setLegalMoves(getLegalMoves(game, pos));
          return;
        }
        setSelected(null);
        setLegalMoves([]);
        return;
      }

      if (piece && piece.color === "w") {
        const pos = { row, col };
        setSelected(pos);
        setLegalMoves(getLegalMoves(game, pos));
      }
    },
    [game, selected, legalMoves, thinking, say],
  );

  const reset = () => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    setGame(createInitialState());
    setSelected(null);
    setLegalMoves([]);
    setThinking(false);
    setEvalScore(0);
    setMessages([]);
    const g = generateGreeting();
    addMessage(g);
    speak(g);
  };

  const handleEngineChange = (next: Engine) => {
    setEngine(next);
    reset();
  };

  const statusText = () => {
    if (engine === "stockfish" && sf.loading)
      return "Loading Stockfish engine…";
    if (engine === "stockfish" && sf.error) return "Engine failed to load";
    if (engine === "stockfish" && !sf.ready && game.turn === "b")
      return "Waiting for engine…";
    if (thinking) return "AI is thinking…";
    switch (game.status) {
      case "checkmate":
        return `Checkmate — ${game.turn === "b" ? "You win! 🎉" : "AI wins."}`;
      case "stalemate":
        return "Stalemate — Draw";
      case "check":
        return `${game.turn === "w" ? "Your" : "AI"} king is in check!`;
      default:
        return game.turn === "w" ? "Your turn (White)" : "AI's turn (Black)";
    }
  };

  const legalTargets = new Set(
    legalMoves.map((m) => `${m.to.row},${m.to.col}`),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Engine + difficulty selector */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            style={btnStyle(engine === "minimax")}
            onClick={() => handleEngineChange("minimax")}
          >
            Built-in AI
          </button>
          <button
            type="button"
            style={btnStyle(engine === "stockfish")}
            onClick={() => handleEngineChange("stockfish")}
          >
            ♟ Stockfish
          </button>
        </div>
        {engine === "stockfish" && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {DIFFICULTIES.map((d, i) => (
              <button
                key={d.label}
                type="button"
                style={btnStyle(diffIdx === i)}
                onClick={() => {
                  setDiffIdx(i);
                  reset();
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
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

      {/* Board + Chat row */}
      <div className={styles.boardChatRow}>
        {/* Board and eval bar stay in normal flow so they resize without overlapping the chat */}
        <div className={styles.boardSection}>
          <EvalBar score={evalScore} isMate={game.status === "checkmate"} />

          <div className={styles.boardGrid}>
            {ROWS.map((row) => (
              <Fragment key={`rank-${8 - row}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--neutral-on-background-weak)",
                    paddingRight: "4px",
                  }}
                >
                  {8 - row}
                </div>

                {FILES.map((file, col) => {
                  const isLight = (row + col) % 2 === 0;
                  const piece = game.board[row][col];
                  const isSelected =
                    selected?.row === row && selected?.col === col;
                  const isLastFrom =
                    game.lastMove?.from.row === row &&
                    game.lastMove?.from.col === col;
                  const isLastTo =
                    game.lastMove?.to.row === row &&
                    game.lastMove?.to.col === col;
                  const isTarget = legalTargets.has(`${row},${col}`);
                  const isKingCheck =
                    game.inCheck &&
                    piece?.type === "K" &&
                    piece.color === game.turn;
                  const isLosingKing =
                    game.status === "checkmate" &&
                    piece?.type === "K" &&
                    piece.color === game.turn;
                  const isWinningKing =
                    game.status === "checkmate" &&
                    piece?.type === "K" &&
                    piece.color !== game.turn;

                  return (
                    <button
                      key={`${8 - row}${file}`}
                      type="button"
                      aria-label={`Square ${file}${8 - row}${piece ? `, ${piece.color === "w" ? "White" : "Black"} ${piece.type}` : ""}`}
                      onClick={() => handleClick(row, col)}
                      className={styles.boardSquare}
                      style={{
                        backgroundColor: isLight ? LIGHT : DARK,
                        position: "relative",
                        cursor:
                          game.turn === "w" && !thinking
                            ? "pointer"
                            : "default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 0,
                        border: "none",
                        padding: 0,
                        outline: "none",
                      }}
                    >
                      {(isLastFrom || isLastTo) && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: MOVED,
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: SEL,
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {isKingCheck && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: CHECK,
                            pointerEvents: "none",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                      {isTarget && !piece && (
                        <div
                          style={{
                            position: "absolute",
                            width: "32%",
                            height: "32%",
                            borderRadius: "50%",
                            backgroundColor: DOT,
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {isTarget && piece && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: `4px solid ${RING}`,
                            boxSizing: "border-box",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {piece && (
                        <span
                          aria-hidden="true"
                          className={styles.pieceGlyph}
                          style={{
                            color: piece.color === "w" ? "#ffffff" : "#1a1008",
                            textShadow:
                              piece.color === "w"
                                ? "0 0 1px #5a3a0a, 0 0 2px #5a3a0a, 0 0 4px #5a3a0a, 0 1px 5px rgba(0,0,0,0.5)"
                                : "0 0 1px rgba(255,255,255,0.25), 0 1px 3px rgba(0,0,0,0.3)",
                            transition: "transform 0.1s ease",
                            transform: isSelected ? "scale(1.12)" : "scale(1)",
                          }}
                        >
                          {SYMBOLS[`${piece.color}${piece.type}`]}
                        </span>
                      )}
                      {isLosingKing && (
                        <div className={`${styles.kingBadge} ${styles.kingBadgeLose}`}>✕</div>
                      )}
                      {isWinningKing && (
                        <div className={`${styles.kingBadge} ${styles.kingBadgeWin}`}>✓</div>
                      )}
                    </button>
                  );
                })}
              </Fragment>
            ))}

            <div style={{ width: "20px" }} />
            {FILES.map((file) => (
              <div
                key={`file-${file}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--neutral-on-background-weak)",
                }}
              >
                {file}
              </div>
            ))}

            {game.status === "checkmate" && (
              <div className={styles.checkmateOverlay}>
                <div className={styles.checkmateTitle}>Checkmate</div>
                <div className={styles.checkmateSubtitle}>
                  {game.turn === "b" ? "You win!" : "AI wins"}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* end board */}

        {/* Chat panel — stretches to board height */}
        <div className={styles.chatPanel}>
          {/* Header */}
          <div className={styles.chatHeader}>AI Commentary</div>

          {/* Messages — fills remaining height and scrolls */}
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
                  ♟
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
      {/* end board + chat row */}

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          type="button"
          onClick={reset}
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
          title={muted ? "Unmute AI" : "Mute AI"}
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
