/**
 * Custom SVG icons not available in react-icons.
 *
 * Each icon must be a React component compatible with react-icons' IconType:
 *   React.ComponentType<React.SVGProps<SVGSVGElement>>
 *
 * To add a new icon:
 * 1. Get the SVG path data from the brand's official assets or https://simpleicons.org
 * 2. Copy the pattern below, replacing the <path> content and viewBox as needed
 * 3. Export the component and add it to iconLibrary in icons.ts
 *
 * IMPORTANT: Replace the placeholder <path> elements below with the real brand SVGs.
 * Official sources:
 *   - Boomi:         https://boomi.com/company/brand-assets/
 *   - Power Apps:    https://learn.microsoft.com/en-us/power-apps/guidance/icons
 *   - Power Platform: https://learn.microsoft.com/en-us/power-platform/guidance/icons
 */

import type { SVGProps } from "react";

type SvgIconProps = SVGProps<SVGSVGElement>;

/**
 * Boomi logo — replace path data with the official SVG from boomi.com/company/brand-assets/
 */
export function BoomiIcon(props: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {/* TODO: Replace with official Boomi SVG path */}
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold">B</text>
    </svg>
  );
}

/**
 * Microsoft Power Apps logo — replace path data with the official SVG.
 */
export function PowerAppsIcon(props: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {/* TODO: Replace with official Power Apps SVG path */}
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold">PA</text>
    </svg>
  );
}

/**
 * Microsoft Power Platform logo — replace path data with the official SVG.
 */
export function PowerPlatformIcon(props: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {/* TODO: Replace with official Power Platform SVG path */}
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold">PP</text>
    </svg>
  );
}
