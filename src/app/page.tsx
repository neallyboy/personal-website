import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.name}>Neal Miran</h1>
          <h2 className={styles.title}>Team Lead, DevOps at Oxford Properties Group</h2>
          <p className={styles.location}>Richmond Hill, Ontario, Canada</p>
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
        <h2 className={styles.sectionTitle}>TECHNICAL SKILLS</h2>
        <p className={styles.text}>
          HTML • CSS • JavaScript • React • jQuery • JSON • PostgreSQL • Oracle • DB2 • Teradata • 
          Microsoft SQL Server • NodeJS • ExpressJS • npm • Webpack • Babel • Bootstrap • Material-UI • 
          RESTful API • Git • GitHub • Git Lab • Python • Selenium • Unix/Linux • PowerApps • Power Automate • 
          Azure DevOps • JIRA • ServiceNow • SSIS • Web Development
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
        <div className={styles.experienceList}>
          <div className={styles.experienceItem}>
            <h3 className={styles.jobTitle}>Team Lead, DevOps</h3>
            <p className={styles.company}>Oxford Properties Group</p>
            <p className={styles.period}>December 2022 - Present</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Design, build, and support cloud or on-premises environments for digital products to be stable and scalable</li>
              <li className={styles.listItem}>Monitor and enhance on-premises SSIS packages, Azure Data Factory pipelines and Boomi processes</li>
              <li className={styles.listItem}>Managing and maintaining public facing websites using Site Generator in Agility CMS</li>
            </ul>
          </div>

          <div className={styles.experienceItem}>
            <h3 className={styles.jobTitle}>Integration Developer</h3>
            <p className={styles.company}>Oxford Properties Group</p>
            <p className={styles.period}>February 2021 - December 2022</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Developing and maintaining upstream and downstream integrations related to internal legacy applications</li>
              <li className={styles.listItem}>Work closely with SRE team for production deployment in ServiceNow</li>
              <li className={styles.listItem}>Create and maintain documentation of updated or new processes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>EDUCATION</h2>
        <div className={styles.educationList}>
          <div className={styles.educationItem}>
            <h3 className={styles.schoolName}>York University</h3>
            <p className={styles.degree}>Certificate, Full Stack Developer</p>
            <p className={styles.period}>2019 - 2020</p>
          </div>

          <div className={styles.educationItem}>
            <h3 className={styles.schoolName}>Ryerson University</h3>
            <p className={styles.degree}>Bachelor of Commerce - BCom, Information Technology Management</p>
            <p className={styles.period}>2004 - 2008</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CONTACT</h2>
        <div className={styles.contact}>
          <p className={styles.text}>Email: neal.miran@gmail.com</p>
          <p className={styles.text}>
            LinkedIn: <a href="https://www.linkedin.com/in/nealmiran" className={styles.link}>www.linkedin.com/in/nealmiran</a>
          </p>
        </div>
      </section>
    </main>
  );
}
