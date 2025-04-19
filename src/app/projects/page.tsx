import Section from '../../components/Section';
import SectionHeader from '../../components/SectionHeader';
import ProjectCard from '../../components/ProjectCard';
import { projects } from '@/data/projects/data';

export default function Projects() {
  return (
    <main className="min-h-screen bg-page-bg px-5 pt-[53px] pb-10">
      <div className="max-w-3xl mx-auto">
        <Section>
          <SectionHeader title="Current Projects" />
          <div className="flex flex-col gap-5">
            {projects
              .filter((project) => !project.completed)
              .map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
          </div>
        </Section>

        <Section>
          <SectionHeader title="Completed Projects" />
          <div className="flex flex-col gap-5">
            {projects
              .filter((project) => project.completed)
              .map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
          </div>
        </Section>
      </div>
    </main>
  );
}