import data from '../data/data.json';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import { getDateRange } from '../utils/dateFormat';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-page-bg px-5 py-10 leading-relaxed">
      <Section className="mb-6 px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-1 text-text-primary">{data.personalInfo.name}</h1>
          <h2 className="text-lg mb-1 text-text-primary">{data.personalInfo.title}</h2>
          <p className="text-base text-text-secondary">{data.personalInfo.location}</p>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Summary" />
        <p className="text-base mb-4 text-text-primary">
          {data.personalInfo.about}
        </p>
      </Section>

      <Section>
        <SectionHeader title="Skills" />
        <p className="text-base mb-4 text-text-primary">
          {data.skills.join(' • ')}
        </p>
      </Section>

      <Section>
        <SectionHeader title="Experience" />
        <div className="flex flex-col gap-6">
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-0">
              <h3 className="text-lg font-semibold mb-1 text-text-primary">{exp.title}</h3>
              <p className="text-base font-medium mb-1 text-text-primary">{exp.company}</p>
              <p className="text-sm mb-1 text-text-secondary">
                {getDateRange(exp.startDate, exp.endDate)}
              </p>
              <ul className="list-disc pl-5 mt-3 mb-4">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="mb-2.5 text-text-primary">{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Education" />
        <div className="flex flex-col gap-6">
          {data.education.map((edu, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-1 text-text-primary">{edu.school}</h3>
              <p className="text-base mb-1 text-text-primary">{edu.degree}</p>
              <p className="text-sm text-text-secondary">{edu.graduationYear}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Contact" />
        <div>
          <p className="text-base mb-4 text-text-primary">Email: {data.personalInfo.email}</p>
          <p className="text-base mb-4 text-text-primary">
            LinkedIn: <a href={data.personalInfo.linkedin} className="text-[#0a66c2] hover:underline">
              {data.personalInfo.linkedin.replace('https://', '')}
            </a>
          </p>
        </div>
      </Section>
    </main>
  );
}
