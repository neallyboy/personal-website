import { ProjectCard } from "@/components";
import WorkTableOfContents from "@/components/work/WorkTableOfContents";
import { baseURL } from "@/resources";
import { getPosts } from "@/utils/utils";
import { Column, Meta, Text } from "@once-ui-system/core";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "Internal Work",
    description: "Password-protected internal project case studies.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Internal Work")}`,
    path: "/internal/work",
  });
}

export default function InternalWorkPage() {
  const internalProjects = getPosts(["src", "app", "work", "projects"])
    .filter((post) => post.metadata.internal)
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
    );

  const tocProjects = internalProjects.map((post) => ({ slug: post.slug, title: post.metadata.title, navTitle: post.metadata.navTitle }));

  return (
    <Column maxWidth="m" paddingTop="24">
      <WorkTableOfContents projects={tocProjects} />
      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        {internalProjects.map((post, index) => (
          <ProjectCard
            priority={index < 2}
            key={post.slug}
            id={post.slug}
            href={`/work/${post.slug}`}
            images={post.metadata.images}
            title={post.metadata.title}
            description={post.metadata.summary}
            content={post.content}
            avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
            link={post.metadata.link || ""}
          />
        ))}
        {internalProjects.length === 0 && (
          <Text align="center" onBackground="neutral-weak">
            No internal projects found.
          </Text>
        )}
      </Column>
    </Column>
  );
}
