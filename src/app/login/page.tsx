import { auth, signIn } from "@/auth";
import { Button, Column, Heading, Icon, Text } from "@once-ui-system/core";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const callbackUrl = from?.startsWith("/") ? from : "/work/internal";

  const session = await auth();
  if (session) redirect(callbackUrl);

  return (
    <Column paddingY="128" maxWidth={24} gap="24" center>
      <Heading align="center" wrap="balance">
        Sign in required
      </Heading>
      <Text align="center" onBackground="neutral-weak" variant="body-default-s">
        This page is restricted. Sign in with GitHub to continue.
      </Text>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: callbackUrl });
        }}
      >
        <Button type="submit" prefixIcon="github">
          Sign in with GitHub
        </Button>
      </form>
    </Column>
  );
}
