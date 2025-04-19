import { Project } from '../types/data';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border border-black/[0.08] rounded-lg p-5 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <h3 className="text-lg font-semibold mb-3 text-text-primary">{project.title}</h3>
      <p className="text-base mb-4 text-text-secondary leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, i) => (
          <span key={i} className="bg-page-bg rounded-full px-3 py-1 text-sm text-text-secondary">
            {tech}
          </span>
        ))}
      </div>
      {project.link && (
        <a 
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-[#0a66c2] hover:underline"
        >
          View Project →
        </a>
      )}
    </div>
  );
}