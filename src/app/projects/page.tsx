export default function Projects() {
  return (
    <main className="min-h-screen bg-page-bg px-5 py-10">
      <section className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">CURRENT PROJECTS</h2>
        <div className="flex flex-col gap-6">
          <div className="border border-black/[0.08] rounded-lg p-5 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <h3 className="text-lg font-semibold mb-3 text-text-primary">Personal Website</h3>
            <p className="text-base mb-4 text-text-secondary leading-relaxed">
              A portfolio website built with Next.js and React to showcase my professional experience and projects.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-page-bg rounded-full px-3 py-1 text-sm text-text-secondary">Next.js</span>
              <span className="bg-page-bg rounded-full px-3 py-1 text-sm text-text-secondary">React</span>
              <span className="bg-page-bg rounded-full px-3 py-1 text-sm text-text-secondary">TypeScript</span>
              <span className="bg-page-bg rounded-full px-3 py-1 text-sm text-text-secondary">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">COMPLETED PROJECTS</h2>
        <div className="flex flex-col gap-6">
          {/* Add completed projects here */}
        </div>
      </section>
    </main>
  )
}