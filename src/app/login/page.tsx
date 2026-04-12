import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

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
  const redirectTo = from && from.startsWith("/") ? from : "/work/internal";

  // If already authenticated, skip the login page
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token && (await verifyAuthToken(token))) {
    redirect(redirectTo);
  }

  return <LoginForm redirectTo={redirectTo} />;
}
