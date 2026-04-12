import { redirect } from "next/navigation";

// This path is now at /internal/work.
// Middleware handles the 301-style redirect before this page renders,
// but this fallback ensures any direct server render also redirects.
export default function LegacyInternalWork() {
  redirect("/internal/work");
}
