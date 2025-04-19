// Common types used across the application
import { Experience } from '@/data/experience/types';
import { Project } from '@/data/projects/types';
import { Education } from '@/data/education/types';
import { NavItem } from '@/data/navigation/types';
import { PersonalInfo } from '@/data/personal-info/types';

// Re-export types for centralized access
export type {
  Experience,
  Project,
  Education,
  NavItem,
  PersonalInfo,
};

// Define app-wide types here
export type MetadataProps = {
  title?: string;
  description?: string;
  keywords?: string[];
};

// Common component props
export type ChildrenProps = {
  children: React.ReactNode;
};

export type WithClassName = {
  className?: string;
};