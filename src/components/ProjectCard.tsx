import { Project } from '../data/projects/types';
import OptimizedImage from './OptimizedImage';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border border-black/[0.08] rounded-lg p-5 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {project.screenshots && project.screenshots.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <OptimizedImage
            src={project.screenshots[0].src}
            alt={project.screenshots[0].alt}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-3 text-text-primary">{project.title}</h3>
      <p className="text-base mb-4 text-text-secondary leading-relaxed">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, i) => (
          <span key={i} className="bg-page-bg rounded-full px-3 py-1 text-sm text-text-secondary">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        {project.githubLink && (
          <a 
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            GitHub →
          </a>
        )}
        {project.liveLink && (
          <a 
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0a66c2] hover:underline"
          >
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
}