export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  about: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  completed?: boolean;
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  graduationYear: string;
}

export interface NavLink {
  href: string;
  text: string;
  icon: string;
}

export interface AppData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  skills: string[];
  projects: Project[];
  education: Education[];
  navLinks: NavLink[];
}