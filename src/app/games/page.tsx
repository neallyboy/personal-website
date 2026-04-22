import { baseURL, games, person } from "@/resources";
import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export async function generateMetadata() {
  return Meta.generate({
    title: games.title,
    description: games.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(games.title)}`,
    path: games.path,
  });
}

const gamesList = [
  {
    href: "/games/chess",
    title: "♟ Julien's AI Chess",
    description:
      "Play chess against a minimax AI with alpha-beta pruning. You play White.",
    image: "/images/games/chess.svg",
    alt: "Chess board preview",
  },
  {
    href: "/games/tictactoe",
    title: "⭕ Jasper's Tic-Tac-Toe",
    description:
      "Play tic-tac-toe against Jasper, a witty AI who claims he has never lost. Three difficulties.",
    image: "/images/games/tictactoe.svg",
    alt: "Tic-tac-toe board preview",
  },
  {
    href: "/games/robot-fight",
    title: "🤖 Robot Brawl",
    description:
      "Street Fighter-style robot brawler. Choose Jasper, Julien, or Mommy and defeat Daddy the AI.",
    image: "/images/games/robot-fight.svg",
    alt: "Robot fight game preview",
  },
];

export default function Games() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={games.title}
        description={games.description}
        path={games.path}
        image={`/api/og/generate?title=${encodeURIComponent(games.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/games`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        Games
      </Heading>

      <div className={styles.gameGrid}>
        {gamesList.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className={styles.gameCardLink}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className={styles.gameCard}
              style={{
                border: "1px solid var(--neutral-alpha-weak)",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color 0.15s, transform 0.15s",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "8/5",
                }}
              >
                <Image
                  src={game.image}
                  alt={game.alt}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    marginBottom: "6px",
                    lineHeight: 1.3,
                  }}
                >
                  {game.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    opacity: 0.6,
                    lineHeight: 1.4,
                  }}
                >
                  {game.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Column>
  );
}
