import { person, social } from "@/resources";
import { IconButton, Row, SmartLink, Text } from "@once-ui-system/core";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerSocialLinks = social.filter(
    (item) => item.essential && item.link && !item.link.startsWith("mailto:"),
  );

  return (
    <Row
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
      s={{ direction: "column" }}
    >
      <Row
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
          style: {
            textAlign: "center",
          },
        }}
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} /</Text>
          <Text paddingX="4">{person.name}</Text>
          <Text onBackground="neutral-weak">
            {/* Usage of this template requires attribution. Please don't remove the link to Once UI unless you have a Pro license. */}
            / Build your portfolio with{" "}
            <SmartLink href="https://once-ui.com/products/magic-portfolio">
              Once UI
            </SmartLink>
          </Text>
        </Text>
        <Row gap="16">
          {footerSocialLinks.map((item) => (
            <IconButton
              key={item.name}
              href={item.link}
              icon={item.icon}
              tooltip={item.name}
              size="s"
              variant="ghost"
            />
          ))}
        </Row>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
