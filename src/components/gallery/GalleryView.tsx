"use client";

import { Column, Heading, Text } from "@once-ui-system/core";

export default function GalleryView() {
  return (
    <Column fillWidth paddingY="128" horizontal="center" vertical="center" gap="16">
      <Heading variant="heading-strong-xl">Coming Soon</Heading>
      <Text onBackground="neutral-weak">The gallery is on its way. Check back soon.</Text>
    </Column>
  );
}
