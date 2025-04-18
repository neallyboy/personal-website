import styles from './page.module.css';
import data from '../data/data.json';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.name}>{data.personalInfo.name}</h1>
          <h2 className={styles.title}>{data.personalInfo.title}</h2>
          <p className={styles.location}>{data.personalInfo.location}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SUMMARY</h2>
        <p className={styles.text}>
          Passionate data developer and software enthusiast with a focus on Full Stack Development. 
          Possesses a firm understanding of back-end technology especially in the persistence layer 
          with broad knowledge and experience in front-end software development.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SKILLS</h2>
        <p className={styles.text}>
          {data.skills.join(' • ')}
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
        <div className={styles.experienceList}>
          {data.experience.map((exp, index) => (
            <div key={index} className={styles.experienceItem}>
              <h3 className={styles.jobTitle}>{exp.title}</h3>
              <p className={styles.company}>{exp.company}</p>
              <p className={styles.period}>{exp.startDate} - {exp.endDate}</p>
              <ul className={styles.list}>
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className={styles.listItem}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>EDUCATION</h2>
        <div className={styles.educationList}>
          <div className={styles.educationItem}>
            <h3 className={styles.schoolName}>{data.education.school}</h3>
            <p className={styles.degree}>{data.education.degree}</p>
            <p className={styles.period}>{data.education.graduationYear}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CONTACT</h2>
        <div className={styles.contact}>
          <p className={styles.text}>Email: {data.personalInfo.email}</p>
          <p className={styles.text}>
            LinkedIn: <a href={data.personalInfo.linkedin} className={styles.link}>{data.personalInfo.linkedin.replace('https://', '')}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
