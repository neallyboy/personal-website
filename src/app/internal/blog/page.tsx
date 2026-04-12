import { baseURL } from "@/resources";
import { getPosts } from "@/utils/utils";
import { Column, Heading, Meta, Text } from "@once-ui-system/core";
import type { Metadata } from "next";
import { SmartLink } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "Internal Blog",
    description: "Password-protected internal blog posts.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Internal Blog")}`,
    path: "/internal/blog",
  });
}

export default function InternalBlogPage() {
  const internalPosts = getPosts(["src", "app", "blog", "posts"])
    .filter((post) => post.metadata.internal)
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
    );

  return (
    <Column maxWidth="m" paddingTop="24">
      <Column fillWidth gap="l" marginBottom="40" paddingX="l">
        {internalPosts.map((post) => (
          <SmartLink key={post.slug} href={`/blog/${post.slug}`} unstyled>
            <Column gap="4">
              <Heading variant="heading-strong-m">{post.metadata.title}</Heading>
              <Text onBackground="neutral-weak" variant="body-default-s">
                {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
              </Text>
              {post.metadata.summary && (
                <Text onBackground="neutral-medium" variant="body-default-m">
                  {post.metadata.summary}
                </Text>
              )}
            </Column>
          </SmartLink>
        ))}
        {internalPosts.length === 0 && (
          <Column fillWidth paddingY="64" horizontal="center" vertical="center" gap="16">
            <Heading variant="heading-strong-l">No internal posts yet</Heading>
            <Text onBackground="neutral-weak">Internal blog posts will appear here.</Text>
          </Column>
        )}
      </Column>
    </Column>
  );
}
