import styles from './page.module.css'

export default function Projects() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CURRENT PROJECTS</h2>
        <div className={styles.projectList}>
          <div className={styles.projectCard}>
            <h3 className={styles.projectTitle}>Personal Website</h3>
            <p className={styles.projectDescription}>
              A portfolio website built with Next.js and React to showcase my professional experience and projects.
            </p>
            <div className={styles.techStack}>
              <span className={styles.techTag}>Next.js</span>
              <span className={styles.techTag}>React</span>
              <span className={styles.techTag}>TypeScript</span>
              <span className={styles.techTag}>CSS Modules</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>COMPLETED PROJECTS</h2>
        <div className={styles.projectList}>
          {/* Add completed projects here */}
        </div>
      </section>
    </main>
  )
}