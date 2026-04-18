import { baseURL, games, person } from "@/resources";
import { Column, Heading, Meta, Schema, SmartLink, Text } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: games.title,
    description: games.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(games.title)}`,
    path: games.path,
  });
}

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

      <Column paddingX="24" gap="16">
        <SmartLink href="/games/chess" style={{ textDecoration: 'none' }}>
          <Column
            border="neutral-alpha-weak"
            radius="l"
            padding="24"
            gap="8"
            style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
          >
            <Heading variant="heading-strong-m">♟ Julien's AI Chess</Heading>
            <Text onBackground="neutral-weak">
              Play chess against a minimax AI with alpha-beta pruning. You play White.
            </Text>
          </Column>
        </SmartLink>

        <SmartLink href="/games/tictactoe" style={{ textDecoration: 'none' }}>
          <Column
            border="neutral-alpha-weak"
            radius="l"
            padding="24"
            gap="8"
            style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
          >
            <Heading variant="heading-strong-m">⭕ Jasper&apos;s Tic-Tac-Toe</Heading>
            <Text onBackground="neutral-weak">
              Play tic-tac-toe against Jasper, a witty AI who claims he has never lost. Three difficulties available.
            </Text>
          </Column>
        </SmartLink>
      </Column>
    </Column>
  );
}
