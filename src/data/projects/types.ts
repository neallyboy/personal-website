export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  screenshots?: ProjectImage[];
  featured?: boolean;
  githubLink?: string;
  liveLink?: string;
  startDate?: string;
  endDate?: string;
  completed?: boolean;
}