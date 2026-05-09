import { baseURL } from "@/resources";
import { Column, Meta } from "@once-ui-system/core";
import type { Metadata } from "next";
import { AuditClient } from "./AuditClient";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "Site Audit",
    description: "Internal SEO, Open Graph, GEO, and AEO audit for nealmiran.com.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Site Audit")}`,
    path: "/internal/tools/audit",
  });
}

export default function AuditPage() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <AuditClient />
    </Column>
  );
}
