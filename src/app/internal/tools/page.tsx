import { baseURL } from "@/resources";
import { Column, Heading, Meta, SmartLink, Text } from "@once-ui-system/core";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "Internal Tools",
    description: "Internal tools and utilities for site management.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Internal Tools")}`,
    path: "/internal/tools",
  });
}

const TOOLS = [
  {
    href: "/internal/tools/audit",
    title: "Site Audit",
    description:
      "Review SEO, Open Graph, Generative Engine Optimization, and Answer Engine Optimization across nealmiran.com.",
    tags: ["SEO", "OG", "GEO", "AEO"],
  },
];

export default function ToolsPage() {
  return (
    <Column maxWidth="m" paddingTop="24" paddingX="l" gap="xl">
      <Column gap="4">
        <Heading variant="heading-strong-xl">Internal Tools</Heading>
        <Text onBackground="neutral-weak" variant="body-default-m">
          Utilities for auditing and managing the site.
        </Text>
      </Column>

      <Column gap="16">
        {TOOLS.map((tool) => (
          <SmartLink
            key={tool.href}
            href={tool.href}
            style={{ textDecoration: "none" }}
          >
            <Column
              padding="20"
              border="neutral-alpha-weak"
              radius="m"
              gap="8"
              style={{ cursor: "pointer", transition: "border-color 0.15s" }}
            >
              <Heading variant="heading-strong-m">{tool.title}</Heading>
              <Text onBackground="neutral-weak" variant="body-default-s">
                {tool.description}
              </Text>
              <Text
                onBackground="brand-medium"
                variant="label-default-s"
                style={{ marginTop: 4 }}
              >
                {tool.tags.join(" · ")}
              </Text>
            </Column>
          </SmartLink>
        ))}
      </Column>
    </Column>
  );
}
