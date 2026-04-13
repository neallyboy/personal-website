"use client";

import { Column, Flex, Text } from "@once-ui-system/core";
import styles from "@/components/about/about.module.scss";

interface WorkTableOfContentsProps {
  projects: { slug: string; title: string; navTitle?: string }[];
}

const WorkTableOfContents: React.FC<WorkTableOfContentsProps> = ({ projects }) => {
  const scrollTo = (id: string, offset: number) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (projects.length === 0) return null;

  return (
    <Column
      left="0"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
      }}
      position="fixed"
      paddingLeft="24"
      gap="32"
      m={{ hide: true }}
    >
      {projects.map((project) => (
        <Flex
          key={project.slug}
          cursor="interactive"
          className={styles.hover}
          gap="8"
          vertical="center"
          onClick={() => scrollTo(project.slug, 80)}
        >
          <Flex height="1" minWidth="16" background="neutral-strong" />
          <Text>{project.navTitle ?? project.title}</Text>
        </Flex>
      ))}
    </Column>
  );
};

export default WorkTableOfContents;
