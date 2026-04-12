"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ScrollToHash() {
  const router = useRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies: router is used as a navigation trigger to re-run the effect
  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;
    if (hash) {
      // Remove the '#' symbol
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [router]);

  return null;
}
