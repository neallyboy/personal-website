import data from '../data/data.json';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-page-bg px-5 py-10 leading-relaxed">
      <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-6 px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-1 text-text-primary">{data.personalInfo.name}</h1>
          <h2 className="text-lg mb-1 text-text-primary">{data.personalInfo.title}</h2>
          <p className="text-base text-text-secondary">{data.personalInfo.location}</p>
        </div>
      </section>

      <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-10 p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">SUMMARY</h2>
        <p className="text-base mb-4 text-text-primary">
          Passionate data developer and software enthusiast with a focus on Full Stack Development. 
          Possesses a firm understanding of back-end technology especially in the persistence layer 
          with broad knowledge and experience in front-end software development.
        </p>
      </section>

      <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-10 p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">SKILLS</h2>
        <p className="text-base mb-4 text-text-primary">
          {data.skills.join(' • ')}
        </p>
      </section>

      <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-10 p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">EXPERIENCE</h2>
        <div className="flex flex-col gap-6">
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-0">
              <h3 className="text-lg font-semibold mb-1 text-text-primary">{exp.title}</h3>
              <p className="text-base font-medium mb-1 text-text-primary">{exp.company}</p>
              <p className="text-sm mb-1 text-text-secondary">{exp.startDate} - {exp.endDate}</p>
              <ul className="list-disc pl-5 mt-3 mb-4">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="mb-2.5 text-text-primary">{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-10 p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">EDUCATION</h2>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-text-primary">{data.education.school}</h3>
            <p className="text-base mb-1 text-text-primary">{data.education.degree}</p>
            <p className="text-sm text-text-secondary">{data.education.graduationYear}</p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-10 p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">CONTACT</h2>
        <div>
          <p className="text-base mb-4 text-text-primary">Email: {data.personalInfo.email}</p>
          <p className="text-base mb-4 text-text-primary">
            LinkedIn: <a href={data.personalInfo.linkedin} className="text-[#0a66c2] hover:underline">{data.personalInfo.linkedin.replace('https://', '')}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
