/**
 * Single source of truth for protected route paths.
 * Imported by both middleware (Edge Runtime) and once-ui.config.ts.
 * Must NOT import from next/font or any Edge-incompatible module.
 *
 * Protection rules (in priority order, all in middleware):
 *  1. /internal/*          — protected by prefix match
 *  2. /work/*-internal     — protected by regex (auto-covers any slug ending in -internal)
 *  3. PROTECTED_PATHS      — explicit list for any path that doesn't follow the -internal
 *                            convention (this is a generic full-path list, not work-specific —
 *                            it also covers the `/blog/*` fix below)
 *
 * NOTE: PROTECTED_PATHS only takes effect on paths that `proxy.ts`'s `config.matcher`
 * actually intercepts. Adding a path here without also covering its prefix in the
 * matcher is a no-op — that mismatch is exactly how an internal blog post leaked
 * publicly (see /blog/internal-case-studies-backlog below).
 */
export const PROTECTED_PATHS = [
  // internal: true in frontmatter, but /blog/* has no naming convention like -internal —
  // listed explicitly until blog content moves to the CMS's `visibility` field
  "/blog/internal-case-studies-backlog",
] as const;

/** Legacy path — /work/internal redirects to /internal/work */
export const LEGACY_INTERNAL_PATH = "/work/internal";

export type ProtectedPath = (typeof PROTECTED_PATHS)[number];
