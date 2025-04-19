import data from '../../data/data.json';
import Section from '../../components/Section';
import SectionHeader from '../../components/SectionHeader';
import ProjectCard from '../../components/ProjectCard';
import PageTransition from '@/components/PageTransition';
import type { Project } from '../../types/data';

export default function Projects() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-page-bg px-5 py-10">
        <div className="max-w-3xl mx-auto">
          <Section>
            <SectionHeader title="Current Projects" />
            <div className="flex flex-col gap-6">
              {data.projects
                .filter((project: Project) => !project.completed)
                .map((project: Project) => (
                  <ProjectCard key={project.title} project={project} />
                ))}
            </div>
          </Section>

          <Section>
            <SectionHeader title="Completed Projects" />
            <div className="flex flex-col gap-6">
              {data.projects
                .filter((project: Project) => project.completed)
                .map((project: Project) => (
                  <ProjectCard key={project.title} project={project} />
                ))}
            </div>
          </Section>
        </div>
      </main>
    </PageTransition>
  );
}