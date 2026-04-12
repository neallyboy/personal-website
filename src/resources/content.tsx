import type {
  About,
  Blog,
  Gallery,
  Home,
  Newsletter,
  Person,
  Social,
  Work,
} from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Neal",
  lastName: "Miran",
  name: "Neal Miran",
  role: "Team Lead, DevOps at Oxford Properties Group",
  avatar: "/images/avatar.png",
  email: "neal.miran@gmail.com",
  location: "America/Toronto",
  languages: ["English"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>Thoughts on DevOps, web platforms, and engineering leadership</>
  ),
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/neallyboy",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/nealmiran",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/once_ui/",
    essential: false,
  },
  {
    name: "Threads",
    icon: "threads",
    link: "https://www.threads.com/@once_ui",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Engineering platforms that scale, ship, and last</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Oxford Properties</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/oxford-corporate-website-reskin",
  },
  subline: (
    <>
      I'm Neal, a Team Lead, DevOps at{" "}
      <Text as="span" size="xl" weight="strong">
        Oxford Properties Group
      </Text>
      , where I lead engineering teams delivering <br /> enterprise web
      platforms. After hours, I run a homelab and build my own projects.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Neal is a Toronto-based DevOps Team Lead with a deep passion for
        building resilient, scalable web platforms and the engineering processes
        that support them. At Oxford Properties Group — part of the OMERS family
        of companies — he leads teams delivering corporate marketing platforms,
        enterprise system integrations, and internal tooling. He bridges the gap
        between modern front-end development and backend infrastructure, with a
        strong focus on developer experience, CI/CD pipelines, and operational
        excellence.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Oxford Properties Group",
        timeframe: "2024 - Present",
        role: "Team Lead, DevOps (Cross-functional)",
        achievements: [
          "Led the first-ever in-house delivery of Oxford's corporate website reskin — a full platform modernization built on Next.js, Agility CMS, Elasticsearch, and Netlify — delivering on time with a small team of two developers and a UX/UI designer.",
          "Architected and managed CI/CD pipelines and branch deployment strategies on Netlify, including a zero-downtime cutover from a legacy branch to a new production main without disrupting existing staging workflows.",
          "Drove the adoption of Storybook for component documentation and Playwright for end-to-end and visual regression testing across the React/Tailwind component library.",
          "Designed and maintained enterprise data integration pipelines using SSIS and Boomi, connecting financial platforms including Yardi, JDE, and internal legacy systems.",
          "Built internal tooling with the Microsoft Power Platform, including PowerApps demand intake applications connected to SharePoint, and Power BI dashboards with custom DAX and M formula logic.",
          "Oversaw AEO/GEO implementation with structured JSON-LD schema markup for leadership pages as part of the corporate site reskin.",
          "Mentored developers through a formal internal Oxford Properties mentorship program, with a focus on front-end architecture, testing practices, and career development.",
        ],
        images: [
          {
            src: "/images/projects/cw-reskin/cw-reskin-home.png",
            alt: "Oxford Properties Corporate Website Reskin",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Oxford Properties Group",
        timeframe: "2020 - 2024",
        role: "Systems & Integration Developer (Cross-functional)",
        achievements: [
          "Developed and maintained SSIS-based financial data pipelines, including schema version handling for CSV processing and SqlBulkCopy column mapping across dev, QA, and production environments.",
          "Collaborated on enterprise integration projects using the Boomi platform, supporting cross-system data flows across the OMERS portfolio.",
          "Contributed to GitHub Enterprise workflows for third-party agency collaboration, implementing branch-protection-compliant PR automation.",
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "Toronto Metropolitan University (formerly Ryerson University)",
        description: (
          <>
            Bachelor of Commerce, Information Technology Management —
            specialization in Telecommunications and Infrastructure Management.
            Graduated 2008.
          </>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Front-End & CMS",
        description: (
          <>
            Building modern, component-driven web applications with Next.js,
            React, and Tailwind CSS. Experienced with Agility CMS for headless
            content delivery, Storybook for component documentation, and
            Playwright for end-to-end and visual regression testing.
          </>
        ),
        tags: [
          { name: "Next.js", icon: "nextjs" },
          { name: "React", icon: "react" },
          { name: "JavaScript", icon: "javascript" },
          { name: "TypeScript", icon: "typescript" },
        ],
        images: [
          {
            src: "/images/projects/cw-reskin/cw-reskin-home.png",
            alt: "Oxford Properties Corporate Site — Home Page",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "DevOps & Infrastructure",
        description: (
          <>
            Managing deployment pipelines on Netlify and Azure DevOps, with
            hands-on experience in CI/CD strategy, branch management, and
            secrets hygiene. Homelab enthusiast running a 3-node Proxmox cluster
            with Ceph storage, a QNAP NAS, and a self-hosted Docker services
            stack.
          </>
        ),
        tags: [
          { name: "Netlify", icon: "netlify" },
          { name: "Azure DevOps", icon: "azure" },
          { name: "Docker", icon: "docker" },
        ],
        images: [],
      },
      {
        title: "Enterprise Integration & Data",
        description: (
          <>
            Designing and maintaining financial data pipelines using SSIS and
            Boomi, integrating platforms such as Yardi, JDE, and internal legacy
            systems. Proficient in SQL, PL/SQL, shell scripting, and Power
            Platform tooling including PowerApps and Power BI.
          </>
        ),
        tags: [
          { name: "SSIS", icon: "sqlServer" },
          { name: "Boomi", icon: "cloud" },
          { name: "SQL", icon: "sqlServer" },
          { name: "Power Platform", icon: "microsoft" },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about engineering, platforms, and DevOps...",
  description: `Read what ${person.name} has been up to recently`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Platform engineering and web development projects by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
