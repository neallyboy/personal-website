import { Projects } from "@/components/work/Projects";
import WorkTableOfContents from "@/components/work/WorkTableOfContents";
import { about, baseURL, person, work } from "@/resources";
import { getPosts } from "@/utils/utils";
import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  const projects = getPosts(["src", "app", "work", "projects"])
    .filter((post) => !post.metadata.internal && !post.metadata.hidden)
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .map((post) => ({ slug: post.slug, title: post.metadata.title, navTitle: post.metadata.navTitle }));

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <WorkTableOfContents projects={projects} />
      <Heading marginBottom="l" variant="heading-strong-xl" align="center">
        {work.title}
      </Heading>
      <Text
        variant="body-default-l"
        onBackground="neutral-weak"
        marginBottom="xl"
        align="center"
      >
        Neal Miran is a DevOps &amp; SRE Team Lead at Oxford Properties Group, building platform engineering, infrastructure automation, and cloud architecture solutions across enterprise real estate systems.
      </Text>
      <Projects />
    </Column>
  );
}
