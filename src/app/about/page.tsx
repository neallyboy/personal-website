import styles from '../page.module.css';

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ABOUT ME</h2>
        <p className={styles.text}>
          I am a passionate DevOps Team Lead and Full Stack Developer with a strong focus on creating efficient, scalable solutions.
          With extensive experience in both front-end and back-end development, I specialize in building robust applications and streamlining development processes.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>MY APPROACH</h2>
        <p className={styles.text}>
          I believe in writing clean, maintainable code and implementing best practices in software development.
          My experience spans across various technologies and frameworks, allowing me to choose the right tools for each specific challenge.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>INTERESTS</h2>
        <p className={styles.text}>
          Beyond coding, I&apos;m passionate about staying up-to-date with the latest technology trends and contributing to the developer community.
          I enjoy solving complex problems and sharing knowledge with fellow developers.
        </p>
      </section>
    </main>
  );
}