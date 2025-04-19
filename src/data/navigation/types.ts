export interface NavLink {
  href: '/' | '/projects' | '/about';  // Explicitly listing all valid routes
  text: string;
  icon: string;
}

export type NavLinkList = NavLink[];