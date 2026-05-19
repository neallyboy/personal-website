"use client";

import { usePathname } from "next/navigation";

import { Footer, Header } from "@/components";
import { Flex } from "@once-ui-system/core";

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDemo = pathname.startsWith("/demos/");

  if (isDemo) {
    return <>{children}</>;
  }

  return (
    <>
      <Flex fillWidth minHeight="16" s={{ hide: true }} />
      <Header />
      <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
        <Flex horizontal="center" fillWidth minHeight="0">
          {children}
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}
