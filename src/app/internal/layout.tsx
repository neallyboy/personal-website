import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  // Defense-in-depth: middleware is the primary gate, this is the fallback.
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isAuth = token ? await verifyAuthToken(token) : false;

  if (!isAuth) {
    redirect("/login?from=/internal/work");
  }

  return <>{children}</>;
}
