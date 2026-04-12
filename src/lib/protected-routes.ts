/**
 * Single source of truth for protected route paths.
 * Imported by both middleware (Edge Runtime) and once-ui.config.ts.
 * Must NOT import from next/font or any Edge-incompatible module.
 *
 * Protection rules (in priority order, all in middleware):
 *  1. /internal/*          — protected by prefix match
 *  2. /work/*-internal     — protected by regex (auto-covers any slug ending in -internal)
 *  3. PROTECTED_PATHS      — explicit list for slugs that don't follow the -internal convention
 */
export const PROTECTED_PATHS = [
  // Slug does not end in -internal so must be listed explicitly
  "/work/automate-design-handovers-with-a-figma-to-code-pipeline",
] as const;

/** Legacy path — /work/internal redirects to /internal/work */
export const LEGACY_INTERNAL_PATH = "/work/internal";

export type ProtectedPath = (typeof PROTECTED_PATHS)[number];
