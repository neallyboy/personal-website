import { Project } from './types';

export const projects: Project[] = [
  {
    title: "Personal Website",
    description: "A modern, responsive personal website built with Next.js and TypeScript.",
    technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    link: "https://github.com/yourusername/personal-website",
    githubLink: "https://github.com/yourusername/personal-website",
    liveLink: "https://yourwebsite.com",
    screenshots: [
      {
        src: "/images/projects/personal-website/home.png",
        alt: "Personal website home page",
        caption: "Modern, responsive home page design"
      }
    ],
    completed: true
  }
];