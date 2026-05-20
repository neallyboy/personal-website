import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import { about, baseURL, person, social } from "@/resources";
import {
  Accordion,
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Media,
  Meta,
  Row,
  Schema,
  Tag,
  Text,
  Timeline,
} from "@once-ui-system/core";
import React from "react";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences
        .filter((e) => !e.hidden)
        .map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
    {
      title: about.websiteSetup.title,
      display: about.websiteSetup.display,
      items: [],
    },
  ];
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        sameAs={social
          .filter((s) => s.essential && s.link.startsWith("http"))
          .map((s) => s.link)}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD scripts require raw JSON text.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SpeakableSpecification",
            cssSelector: [".bio-summary"],
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD scripts require raw JSON text.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Neal Miran's role?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Neal Miran is a Team Lead, DevOps & SRE at Oxford Properties Group, specializing in platform engineering, infrastructure automation, and cloud architecture across enterprise real estate systems.",
                },
              },
              {
                "@type": "Question",
                name: "What technologies does Neal Miran specialize in?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Neal Miran specializes in Kubernetes, Terraform, AWS, DevOps, SRE, platform engineering, and cloud architecture.",
                },
              },
              {
                "@type": "Question",
                name: "Where does Neal Miran work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Neal Miran works at Oxford Properties Group, a leading global real estate company, where he leads DevOps and SRE initiatives.",
                },
              },
            ],
          }),
        }}
      />
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar
              src={person.avatar}
              size="xl"
              aria-label={`${person.name} profile photo`}
            />
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" aria-hidden="true" />
              {person.location}
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((language) => (
                  <Tag key={language} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{
                  backdropFilter: "blur(var(--static-space-1))",
                }}
              >
                <Icon
                  paddingLeft="12"
                  name="calendar"
                  onBackground="brand-weak"
                  aria-hidden="true"
                />
                <Row paddingX="8">Schedule a call</Row>
                <IconButton
                  href={about.calendar.link}
                  aria-label="Schedule a call"
                  data-border="rounded"
                  variant="secondary"
                  icon="chevronRight"
                />
              </Row>
            )}
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social
                  .filter((item) => item.essential)
                  .map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button
                              key={item.name}
                              href={item.link}
                              prefixIcon={item.icon}
                              label={item.name}
                              size="s"
                              weight="default"
                              variant="secondary"
                            />
                          </Row>
                          <Row hide s={{ hide: false }}>
                            <IconButton
                              size="l"
                              key={`${item.name}-icon`}
                              href={item.link}
                              icon={item.icon}
                              aria-label={item.name}
                              variant="secondary"
                            />
                          </Row>
                        </React.Fragment>
                      ),
                  )}
              </Row>
            )}
          </Column>

          {about.intro.display && (
            <Column
              textVariant="body-default-l"
              fillWidth
              gap="m"
              marginBottom="xl"
              className="bio-summary"
            >
              {about.intro.description}
            </Column>
          )}

          {about.work.display && (
            <>
              <Heading
                as="h2"
                id={about.work.title}
                variant="display-strong-s"
                marginBottom="m"
              >
                {about.work.title}
              </Heading>
              <Column fillWidth marginBottom="40">
                <Timeline
                  size="xs"
                  items={about.work.experiences
                    .filter((e) => !e.hidden)
                    .map((experience, index) => ({
                      label: (
                        <Row
                          key={`label-${experience.company}-${experience.timeframe}`}
                          fillWidth
                          horizontal="between"
                          vertical="center"
                        >
                          <Row gap="12" vertical="center">
                            {experience.logo && (
                              <Avatar
                                src={experience.logo}
                                size="s"
                                aria-label={`${experience.company} logo`}
                                style={{
                                  borderRadius: "var(--radius-s)",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <Text
                              id={experience.company}
                              variant="heading-strong-l"
                            >
                              {experience.company}
                            </Text>
                          </Row>
                          <Text
                            variant="heading-default-xs"
                            onBackground="neutral-weak"
                          >
                            {experience.timeframe}
                          </Text>
                        </Row>
                      ),
                      description: (
                        <Text
                          key={`desc-${experience.company}-${experience.timeframe}`}
                          variant="body-default-s"
                          onBackground="brand-weak"
                        >
                          {experience.role}
                        </Text>
                      ),
                      state: index === 0 ? "active" : "default",
                      children: (
                        <Accordion
                          key={`children-${experience.company}-${experience.timeframe}`}
                          title={
                            <Text
                              variant="body-default-m"
                              onBackground="neutral-weak"
                            >
                              Key Achievements
                            </Text>
                          }
                          open={index < 2}
                          size="s"
                          icon="plus"
                          iconRotation={45}
                        >
                          <Column fillWidth gap="m" paddingTop="8">
                            <Column as="ul" gap="16">
                              {experience.achievements.map(
                                (
                                  achievement: React.ReactNode,
                                  achIndex: number,
                                ) => (
                                  <Text
                                    as="li"
                                    variant="body-default-m"
                                    key={`${experience.company}-${achIndex}`}
                                  >
                                    {achievement}
                                  </Text>
                                ),
                              )}
                            </Column>
                            {experience.images &&
                              experience.images.length > 0 && (
                                <Row fillWidth paddingTop="m" gap="12" wrap>
                                  {experience.images.map((image) => (
                                    <Row
                                      key={image.src}
                                      border="neutral-medium"
                                      radius="m"
                                      minWidth={image.width}
                                      height={image.height}
                                    >
                                      <Media
                                        enlarge
                                        radius="m"
                                        sizes={image.width.toString()}
                                        alt={image.alt}
                                        src={image.src}
                                      />
                                    </Row>
                                  ))}
                                </Row>
                              )}
                          </Column>
                        </Accordion>
                      ),
                    }))}
                />
              </Column>
            </>
          )}

          {about.studies.display && (
            <>
              <Heading
                as="h2"
                id={about.studies.title}
                variant="display-strong-s"
                marginBottom="m"
              >
                {about.studies.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {about.studies.institutions.map((institution, index) => (
                  <Column
                    key={`${institution.name}-${index}`}
                    fillWidth
                    gap="4"
                  >
                    <Text id={institution.name} variant="heading-strong-l">
                      {institution.name}
                    </Text>
                    <Text
                      variant="heading-default-xs"
                      onBackground="neutral-weak"
                    >
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.technical.display && (
            <>
              <Heading
                as="h2"
                id={about.technical.title}
                variant="display-strong-s"
                marginBottom="40"
              >
                {about.technical.title}
              </Heading>
              <Column fillWidth gap="l">
                {about.technical.skills.map((skill) => (
                  <Column key={skill.title} fillWidth gap="4">
                    <Text id={skill.title} variant="heading-strong-l">
                      {skill.title}
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {skill.description}
                    </Text>
                    {skill.tags && skill.tags.length > 0 && (
                      <Row wrap gap="8" paddingTop="8">
                        {skill.tags.map((tag, tagIndex) => (
                          <Tag
                            key={`${skill.title}-${tagIndex}`}
                            size="l"
                            prefixIcon={tag.icon}
                          >
                            {tag.name}
                          </Tag>
                        ))}
                      </Row>
                    )}
                    {skill.images && skill.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap>
                        {skill.images.map((image) => (
                          <Row
                            key={image.src}
                            border="neutral-medium"
                            radius="m"
                            minWidth={image.width}
                            height={image.height}
                          >
                            <Media
                              enlarge
                              radius="m"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.websiteSetup.display && (
            <>
              <Heading
                as="h2"
                id={about.websiteSetup.title}
                variant="display-strong-s"
                marginBottom="m"
                marginTop="40"
              >
                {about.websiteSetup.title}
              </Heading>
              <Row fillWidth gap="16" wrap marginBottom="40">
                {about.websiteSetup.tools.map((tool) => (
                  <Column
                    key={tool.name}
                    gap="8"
                    padding="20"
                    border="neutral-medium"
                    radius="m"
                    background="neutral-weak"
                    style={{ flex: "1 1 180px", minWidth: "180px" }}
                  >
                    <img
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      width={36}
                      height={36}
                      loading="lazy"
                      style={{ borderRadius: "6px", flexShrink: 0 }}
                    />
                    <Text variant="heading-strong-s">{tool.name}</Text>
                    <Text
                      variant="body-default-xs"
                      onBackground="neutral-weak"
                      style={{ lineHeight: "160%" }}
                    >
                      {tool.description}
                    </Text>
                  </Column>
                ))}
              </Row>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}
