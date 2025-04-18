import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Welcome to My Resume Website</h1>
        <p>Showcasing my projects and skills.</p>
      </section>

      <section className={styles.projects}>
        <h2>Projects</h2>
        <ul>
          <li>
            <h3>PowerApps</h3>
            <p>Custom business solutions built with PowerApps.</p>
          </li>
          <li>
            <h3>Websites</h3>
            <p>Modern and responsive websites for various clients.</p>
          </li>
          <li>
            <h3>Ford Web Scraper</h3>
            <p>A web scraper designed to extract data from Ford&apos;s website.</p>
          </li>
          <li>
            <h3>Integration Projects</h3>
            <p>Seamless integrations between different systems and platforms.</p>
          </li>
        </ul>
      </section>

      <section className={styles.contact}>
        <h2>Contact Me</h2>
        <p>Feel free to reach out for collaborations or inquiries.</p>
      </section>
    </main>
  );
}
