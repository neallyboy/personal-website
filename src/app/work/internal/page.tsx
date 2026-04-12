import { ProjectCard } from "@/components";
import { about, baseURL, person } from "@/resources";
import { getPosts } from "@/utils/utils";
import { Column, Heading, Meta, Text } from "@once-ui-system/core";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "Internal Projects",
    description: "Password-protected internal project case studies.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Internal Projects")}`,
    path: "/work/internal",
  });
}

export default function InternalWork() {
  const internalProjects = getPosts(["src", "app", "work", "projects"]).filter(
    (post) => post.metadata.internal,
  );

  const sorted = internalProjects.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );

  return (
    <Column maxWidth="m" paddingTop="24">
      <Heading marginBottom="8" variant="heading-strong-xl" align="center">
        Internal Projects
      </Heading>
      <Text
        align="center"
        onBackground="neutral-weak"
        variant="body-default-m"
        marginBottom="xl"
      >
        Full case studies with confidential details. Password protected.
      </Text>
      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        {sorted.map((post, index) => (
          <ProjectCard
            priority={index < 2}
            key={post.slug}
            href={`/work/${post.slug}`}
            images={post.metadata.images}
            title={post.metadata.title}
            description={post.metadata.summary}
            content={post.content}
            avatars={
              post.metadata.team?.map((member) => ({ src: member.avatar })) ||
              []
            }
            link={post.metadata.link || ""}
          />
        ))}
        {sorted.length === 0 && (
          <Text align="center" onBackground="neutral-weak">
            No internal projects found.
          </Text>
        )}
      </Column>
    </Column>
  );
}
