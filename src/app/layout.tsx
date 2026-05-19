import "@/resources/custom.css";

import classNames from "classnames";
import Script from "next/script";

import { ConditionalShell, Providers, RouteGuard } from "@/components";
import {
  baseURL,
  dataStyle,
  effects,
  fonts,
  home,
  person,
  social,
  style,
} from "@/resources";
import {
  Background,
  Column,
  Flex,
  Meta,
  type SpacingToken,
  type opacity,
} from "@once-ui-system/core";

export async function generateMetadata() {
  const base = Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: `${baseURL}/api/og/generate?title=${encodeURIComponent(home.title)}`,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      siteName: person.name,
    },
    icons: {
      icon: [{ url: "/icon.webp", type: "image/webp" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enableTagManager =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENABLE_GTM_DEV === "true";

  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="en"
      data-scroll-behavior="smooth"
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head suppressHydrationWarning>
        {/* Warm up third-party domains before scripts load */}
        <link rel="preconnect" href="https://nealmiran.com" />
        <link rel="dns-prefetch" href="https://nealmiran.com" />
        <script
          suppressHydrationWarning
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const defaultTheme = 'system';
                  
                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    "solid-style": style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    "viz-style": dataStyle.variant,
                  })};
                  
                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  
                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  // Apply saved theme
                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <script
          suppressHydrationWarning
          id="consent-default"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:2000});`,
          }}
        />
        {enableTagManager && (
          <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://nealmiran.com/metrics/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KT3HS3JK');`,
            }}
          />
        )}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: person.name,
              jobTitle: "Team Lead, DevOps & SRE",
              url: baseURL,
              email: person.email,
              worksFor: {
                "@type": "Organization",
                name: "Oxford Properties Group",
              },
              knowsAbout: [
                "Kubernetes",
                "Terraform",
                "AWS",
                "DevOps",
                "SRE",
                "Platform Engineering",
                "Cloud Architecture",
                "Infrastructure Automation",
              ],
              sameAs: social
                .filter((s) => s.essential && s.link.startsWith("http"))
                .map((s) => s.link),
            }),
          }}
        />
      </head>
      <Providers>
        <Column
          as="body"
          background="page"
          fillWidth
          style={{ minHeight: "100vh" }}
          margin="0"
          padding="0"
          horizontal="center"
        >
          {enableTagManager && (
            <noscript>
              <iframe
                src="https://nealmiran.com/metrics/ns.html?id=GTM-KT3HS3JK"
                height="0"
                width="0"
                title="Google Tag Manager"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}
          <Flex fill position="absolute">
            <Background
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor,
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
          </Flex>
          <ConditionalShell>
            <RouteGuard>{children}</RouteGuard>
          </ConditionalShell>
        </Column>
      </Providers>
    </Flex>
  );
}
