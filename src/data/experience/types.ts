export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  achievements: string[];
  companyLogo?: string; // Path to the company logo in public/images/companies
}

export type ExperienceList = Experience[];