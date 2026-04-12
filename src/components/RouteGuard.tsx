"use client";

import NotFound from "@/app/not-found";
import { routes } from "@/resources";
import { usePathname } from "next/navigation";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();

  if (!pathname) return <>{children}</>;

  // Explicitly disabled top-level routes → 404
  if (pathname in routes) {
    if (!routes[pathname as keyof typeof routes]) return <NotFound />;
    return <>{children}</>;
  }

  // Dynamic routes gated by their parent toggle
  const dynamicRoutes = ["/blog", "/work"] as const;
  for (const route of dynamicRoutes) {
    if (pathname.startsWith(route)) {
      if (!routes[route]) return <NotFound />;
      return <>{children}</>;
    }
  }

  // Any other path (e.g. /login, /api/*) — let Next.js handle it
  return <>{children}</>;
};

export { RouteGuard };
