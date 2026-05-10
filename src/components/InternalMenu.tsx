"use client";

import { Column, Flex, ToggleButton } from "@once-ui-system/core";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { icon: "grid" as const, label: "Work", href: "/internal/work" },
  { icon: "book" as const, label: "Blog", href: "/internal/blog" },
  { icon: "gallery" as const, label: "Gallery", href: "/internal/gallery" },
  { icon: "tools" as const, label: "Tools", href: "/internal/tools" },
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

  // Close on navigation — pathname is the intended trigger, not a value used inside the effect.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = pathname.startsWith("/internal") || pathname === "/login";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Desktop: with label */}
      <Flex s={{ hide: true }}>
        <ToggleButton
          prefixIcon="lock"
          label="Internal"
          selected={isActive || open}
          onClick={() => setOpen((o) => !o)}
        />
      </Flex>
      {/* Mobile: icon only */}
      <Flex hide s={{ hide: false }}>
        <ToggleButton
          prefixIcon="lock"
          aria-label="Internal"
          selected={isActive || open}
          onClick={() => setOpen((o) => !o)}
        />
      </Flex>

      {open && (
        <Column
          position="absolute"
          top="12"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            zIndex: 100,
          }}
          s={{
            style: {
              top: "auto",
              bottom: "calc(100% + 8px)",
            },
          }}
        >
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
        </Column>
      )}
    </div>
  );
}
