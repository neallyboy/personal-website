export interface NavLink {
  href: '/' | '/projects' | '/about';  // Explicitly listing all valid routes
  text: string;
  icon: string;
}

// This is the type that was referenced in types/index.ts
export type NavItem = NavLink;

export type NavLinkList = NavLink[];