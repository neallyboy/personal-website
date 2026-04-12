/**
 * Single source of truth for protected route paths.
 * Imported by both middleware (Edge Runtime) and once-ui.config.ts.
 * Must NOT import from next/font or any Edge-incompatible module.
 */
export const PROTECTED_PATHS = [
  "/work/internal",
  "/work/oxford-corporate-website-reskin-internal",
  "/work/automate-design-handovers-with-a-figma-to-code-pipeline",
] as const;

export type ProtectedPath = (typeof PROTECTED_PATHS)[number];
