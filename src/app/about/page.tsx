import PageTransition from '@/components/PageTransition';

export default function AboutPage() {
  return (
    <PageTransition>
      <main className="flex flex-col items-center min-h-screen bg-page-bg px-5 py-10">
        <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-10 p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">ABOUT ME</h2>
          <p className="text-base mb-4 text-text-primary">
            I am a passionate DevOps Team Lead and Full Stack Developer with a strong focus on creating efficient, scalable solutions.
            With extensive experience in both front-end and back-end development, I specialize in building robust applications and streamlining development processes.
          </p>
        </section>

        <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-10 p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">MY APPROACH</h2>
          <p className="text-base mb-4 text-text-primary">
            I believe in writing clean, maintainable code and implementing best practices in software development.
            My experience spans across various technologies and frameworks, allowing me to choose the right tools for each specific challenge.
          </p>
        </section>

        <section className="w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-10 p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">INTERESTS</h2>
          <p className="text-base mb-4 text-text-primary">
            Beyond coding, I&apos;m passionate about staying up-to-date with the latest technology trends and contributing to the developer community.
            I enjoy solving complex problems and sharing knowledge with fellow developers.
          </p>
        </section>
      </main>
    </PageTransition>
  );
}