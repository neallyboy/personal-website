import { Row, Column, Text } from "@once-ui-system/core";

interface TechItem {
  name: string;
  description: string;
  iconSrc?: string;
}

interface TechStackProps {
  items: TechItem[];
}

export function TechStack({ items }: TechStackProps) {
  return (
    <Column gap="12" marginTop="8" marginBottom="12">
      {items.map((item) => (
        <Row key={item.name} gap="12" vertical="start">
          {item.iconSrc ? (
            <img
              src={item.iconSrc}
              alt={item.name}
              width={20}
              height={20}
              style={{ flexShrink: 0, marginTop: "3px" }}
            />
          ) : (
            <div style={{ width: 20, height: 20, flexShrink: 0 }} />
          )}
          <Text
            variant="body-default-m"
            onBackground="neutral-medium"
            style={{ lineHeight: "175%" }}
          >
            <strong>{item.name}:</strong> {item.description}
          </Text>
        </Row>
      ))}
    </Column>
  );
}
