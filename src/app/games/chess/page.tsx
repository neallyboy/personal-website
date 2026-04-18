import { ChessGame } from '@/components/games/chess/ChessGame';
import { baseURL } from '@/resources';
import { Column, Heading, Meta } from '@once-ui-system/core';

export async function generateMetadata() {
  return Meta.generate({
    title: "Julien's AI Chess | Neal Miran",
    description: 'Play chess against an AI opponent — minimax engine with alpha-beta pruning.',
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Julien's AI Chess")}`,
    path: '/games/chess',
  });
}

export default function ChessPage() {
  return (
    <Column fillWidth paddingTop="24" paddingBottom="64" horizontal="center">
      <Heading marginBottom="l" variant="heading-strong-xl">
        Julien's AI Chess
      </Heading>
      <ChessGame />
    </Column>
  );
}
