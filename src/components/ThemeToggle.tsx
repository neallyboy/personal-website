"use client";

import { ToggleButton, useTheme } from "@once-ui-system/core";
import type React from "react";
import { memo, useEffect, useState } from "react";

function resolveTheme(theme: string): string {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme || "light";
}

export const ThemeToggle: React.FC = memo(() => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive current theme at render time — no separate state needed.
  // Falls back to "light" before mount to avoid hydration mismatch.
  const currentTheme = mounted ? resolveTheme(theme) : "light";
  const nextTheme = currentTheme === "light" ? "dark" : "light";

  return (
    <ToggleButton
      prefixIcon={currentTheme === "dark" ? "light" : "dark"}
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
    />
  );
});

ThemeToggle.displayName = "ThemeToggle";
