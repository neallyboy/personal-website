import "@/resources/custom.css";

import classNames from "classnames";

import { Providers } from "@/components";
import { dataStyle, fonts, style } from "@/resources";

export const metadata = {
  title: "Google Maps Clustering Demo",
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
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
                  Object.entries(config).forEach(([k, v]) => root.setAttribute('data-' + k, v));
                  const saved = localStorage.getItem('data-theme');
                  const resolved = (!saved || saved === 'system')
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : saved;
                  root.setAttribute('data-theme', resolved);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <Providers>
        <body style={{ margin: 0, padding: "2rem", background: "var(--page-background)", minHeight: "100vh" }}>
          {children}
        </body>
      </Providers>
    </html>
  );
}
