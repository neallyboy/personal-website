import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  // Defense-in-depth: middleware is the primary gate, this is the fallback.
  const session = await auth();

  if (!session) {
    redirect("/login?from=/internal/work");
  }

  return <>{children}</>;
}
