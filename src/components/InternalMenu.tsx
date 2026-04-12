"use client";

import { Column, ToggleButton } from "@once-ui-system/core";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.scss";

const SECTIONS = [
  { icon: "grid" as const, label: "Work", href: "/internal/work" },
  { icon: "book" as const, label: "Blog", href: "/internal/blog" },
  { icon: "gallery" as const, label: "Gallery", href: "/internal/gallery" },
];

export function InternalMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = pathname.startsWith("/internal") || pathname === "/login";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Desktop: with label */}
      <div className={styles.desktopOnly}>
        <ToggleButton
          prefixIcon="lock"
          label="Internal"
          selected={isActive || open}
          onClick={() => setOpen((o) => !o)}
        />
      </div>
      {/* Mobile: icon only */}
      <div className={styles.mobileOnly}>
        <ToggleButton
          prefixIcon="lock"
          selected={isActive || open}
          onClick={() => setOpen((o) => !o)}
        />
      </div>

      {open && (
        <div className={styles.dropdown}>
          <Column
            background="page"
            border="neutral-alpha-weak"
            radius="m"
            shadow="l"
            padding="4"
            gap="2"
          >
            {SECTIONS.map((section) => (
              <ToggleButton
                key={section.href}
                prefixIcon={section.icon}
                label={section.label}
                href={section.href}
                selected={pathname.startsWith(section.href)}
              />
            ))}
          </Column>
        </div>
      )}
    </div>
  );
}
