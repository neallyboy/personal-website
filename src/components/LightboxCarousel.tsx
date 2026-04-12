"use client";

import { Column, Flex, IconButton, Media, Row, Tag } from "@once-ui-system/core";
import type { ColorScheme } from "@once-ui-system/core";
import { useState } from "react";

interface CarouselBadge {
  label: string;
  variant?: ColorScheme;
}

interface CarouselItem {
  src: string;
  alt: string;
  badges?: CarouselBadge[];
}

interface LightboxCarouselProps {
  items: CarouselItem[];
}

export function LightboxCarousel({ items }: LightboxCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const current = items[activeIndex];

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => Math.max(0, i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => Math.min(items.length - 1, i + 1));
  };

  return (
    <>
      <Column fillWidth gap="12">
        {/* Main slide */}
        <Flex
          fillWidth
          radius="l"
          border="neutral-alpha-weak"
          overflow="hidden"
          style={{ position: "relative" }}
        >
          <Media
            src={current.src}
            alt={current.alt}
            fillWidth
            aspectRatio="16/9"
            objectFit="cover"
            sizes="(max-width: 960px) 100vw, 960px"
          />

          {/* Lightbox click zone — sits above image, below nav buttons */}
          <Flex
            position="absolute"
            top="0"
            left="0"
            fillWidth
            fillHeight
            style={{ zIndex: 1, cursor: "zoom-in" }}
            onClick={() => setLightboxOpen(true)}
          />

          {/* Badges — pointer-events none so they don't block the click zone */}
          {current.badges && current.badges.length > 0 && (
            <Row
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                gap: "8px",
                zIndex: 3,
                pointerEvents: "none",
              }}
            >
              {current.badges.map((b) => (
                <Tag key={b.label} label={b.label} variant={b.variant ?? "neutral"} />
              ))}
            </Row>
          )}

          {/* Prev button — z-index above click zone */}
          {activeIndex > 0 && (
            <Flex
              position="absolute"
              style={{
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            >
              <IconButton icon="chevronLeft" variant="secondary" onClick={prev} />
            </Flex>
          )}

          {/* Next button — z-index above click zone */}
          {activeIndex < items.length - 1 && (
            <Flex
              position="absolute"
              style={{
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            >
              <IconButton icon="chevronRight" variant="secondary" onClick={next} />
            </Flex>
          )}
        </Flex>

        {/* Line indicator */}
        {items.length > 1 && (
          <Row gap="4" paddingX="s" fillWidth horizontal="center">
            {items.map((item, i) => (
              <Flex
                key={item.src}
                radius="full"
                fillWidth
                style={{
                  height: "2px",
                  cursor: "pointer",
                  background:
                    i === activeIndex
                      ? "var(--neutral-on-background-strong)"
                      : "var(--neutral-alpha-medium)",
                  transition: "background 0.3s ease",
                }}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </Row>
        )}
      </Column>

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <Flex
          center
          position="fixed"
          top="0"
          left="0"
          background="overlay"
          style={{
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Prev button */}
          {activeIndex > 0 && (
            <Flex
              position="absolute"
              style={{ left: "24px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => i - 1); }}
            >
              <IconButton icon="chevronLeft" variant="secondary" size="l" />
            </Flex>
          )}

          <Media
            src={current.src}
            alt={current.alt}
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            objectFit="contain"
            sizes="90vw"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {activeIndex < items.length - 1 && (
            <Flex
              position="absolute"
              style={{ right: "24px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => i + 1); }}
            >
              <IconButton icon="chevronRight" variant="secondary" size="l" />
            </Flex>
          )}

          {/* Slide counter */}
          <Flex
            position="absolute"
            style={{ bottom: "24px", left: "50%", transform: "translateX(-50%)" }}
          >
            <Tag label={`${activeIndex + 1} / ${items.length}`} variant="neutral" />
          </Flex>
        </Flex>
      )}
    </>
  );
}
