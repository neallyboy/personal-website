'use client';

import { Experience } from '../data/experience/types';
import OptimizedImage from './OptimizedImage';
import { getDateRange } from '../utils/dateFormat';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="flex gap-4 p-5 border border-black/[0.08] rounded-lg transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {experience.companyLogo && (
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-white rounded-lg overflow-hidden">
          <OptimizedImage
            src={experience.companyLogo}
            alt={`${experience.company} logo`}
            width={64}
            height={64}
            className="w-12 h-12 object-contain"
          />
        </div>
      )}
      
      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-1 text-text-primary">{experience.title}</h3>
        <p className="text-base font-medium mb-1 text-text-primary">{experience.company}</p>
        <p className="text-sm mb-1 text-text-secondary">
          {getDateRange(experience.startDate, experience.endDate)}
        </p>
        <ul className="list-disc pl-5 mt-3 mb-0">
          {experience.achievements.map((achievement, i) => (
            <li key={i} className="mb-2.5 text-text-primary">{achievement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}