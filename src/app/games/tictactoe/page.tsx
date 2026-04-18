import { TicTacToe } from '@/components/games/tictactoe/TicTacToe';
import { baseURL } from '@/resources';
import { Column, Heading, Meta } from '@once-ui-system/core';

export async function generateMetadata() {
  return Meta.generate({
    title: "Jasper's Tic-Tac-Toe | Neal Miran",
    description: "Play tic-tac-toe against Jasper, a witty AI who has never lost — or so he claims.",
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Jasper's Tic-Tac-Toe")}`,
    path: '/games/tictactoe',
  });
}

export default function TicTacToePage() {
  return (
    <Column fillWidth paddingTop="24" paddingBottom="64" horizontal="center">
      <Heading marginBottom="l" variant="heading-strong-xl">
        Jasper&apos;s Tic-Tac-Toe
      </Heading>
      <TicTacToe />
    </Column>
  );
}
