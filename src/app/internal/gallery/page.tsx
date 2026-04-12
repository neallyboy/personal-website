import { baseURL } from "@/resources";
import { Column, Heading, Meta, Text } from "@once-ui-system/core";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "Internal Gallery",
    description: "Password-protected internal gallery.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Internal Gallery")}`,
    path: "/internal/gallery",
  });
}

export default function InternalGalleryPage() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Column fillWidth paddingY="64" horizontal="center" vertical="center" gap="16">
        <Heading variant="heading-strong-l">No internal gallery yet</Heading>
        <Text onBackground="neutral-weak">Internal gallery images will appear here.</Text>
      </Column>
    </Column>
  );
}
