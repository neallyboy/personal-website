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
  languages: [],
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
      </Text>{" "}
      — technically deep, business minded. I turn complex problems into
      integrations, internal tools, and web platforms that close gaps, connect
      data, and help teams make better decisions.
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
        timeframe: "Dec 2022 - Present",
        logo: "/images/logos/oxford_properties_group_logo.jpeg",
        role: "Team Lead, DevOps · Permanent Full-time",
        achievements: [
          "Led the first-ever in-house delivery of Oxford's corporate website reskin, a full platform modernisation built on Next.js, Agility CMS, Elasticsearch, and Netlify, delivering on time with a small team of two developers and a UX/UI designer.",
          "Architected and developed data pipelines for the Retail Marketing Team capturing user traffic and signups on Oxford's corporate website, integrating with Simon Data (a new customer data platform) for analytics and email marketing, using Boomi for pipelines and AWS S3 for storage.",
          "Implemented a property search enhancement on the Lease With Us page reducing result latency from 6 seconds to under 1 second using Oxford's Lease-With-Us API and Elasticsearch for caching.",
          "Developed Building Admin, a PowerApps application replacing a legacy Remedy platform app, resulting in over $200,000/year in licence cost savings, working with business end users and IT for discovery of functionality, data sources, and flow.",
          "Implemented CI/CD for PowerApps Canvas Apps and Azure Data Factory pipelines using Azure DevOps build and release pipelines.",
          "Managed and maintained public-facing websites using Agility CMS Site Generator, triggering build and deploy to Netlify CDN.",
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
        timeframe: "Feb 2021 - Dec 2022",
        logo: "/images/logos/oxford_properties_group_logo.jpeg",
        role: "Integration Developer · Permanent Full-time",
        achievements: [
          "Designed and developed a new ingestion and validation process for financial and non-financial data for third-party property managers, standardising data collection and removing manual intervention to satisfy audit requirements.",
          "Re-architected all VTS integrations following deprecation of the VTS XML API, migrating to their next-gen JSON APIs, switching from SSIS to Azure Data Factory, and redesigning database structures for new data points.",
          "Worked with Suite Spot to update their API to allow Oxford to send additional data fields for residential move-in and move-out jobs, improving unit turnover visibility and operational cost tracking.",
          "Led Azure Cloud Migration analysis for on-premises VTS integrations.",
          "Key contributor in migrating legacy .NET web applications from SQL Server 2008/2012 to SQL Server 2019.",
          "Responsible for testing all on-premises external web applications for Windows Server in-place upgrades from 2012 to 2019 due to end-of-life support.",
        ],
        images: [],
      },
      {
        company: "York Region District School Board",
        timeframe: "Nov 2020 - Feb 2021",
        logo: "/images/logos/york_region_district_school_board_logo.jpeg",
        role: "Programming Analyst · Permanent Full-time",
        achievements: [
          "Assisted in developing and implementing ILARRS, a new attendance and replacement application for language teachers.",
          "Integrated a new Supervisor form in ILARRS holding supervisor emergency contact details, enabling notifications when a language teacher reports an absence two hours or less before their scheduled class time.",
          "Worked with the Data Quality Management team updating and enhancing SQL Server stored procedures for scheduled monthly data audits.",
        ],
        images: [],
      },
      {
        company: "Ontario Ministry of the Solicitor General",
        timeframe: "Sep 2020 - Nov 2020",
        logo: "/images/logos/ontario_ministry_of_the_solicitor_general_logo.jpeg",
        role: "Programmer Developer L3 · Contract Full-time",
        achievements: [
          "Supported and maintained eRoster, a shift scheduling application used across 25 correctional institutions with over 4,000 users.",
          "Added new business rule logic across multiple reports for Daily Roster, Overtime, and Other Duty charges.",
          "Developed additional web portal features for better user redirection, added user prompts for selection confirmation and error messages on business rule violations, and added a site map for AODA compliance.",
        ],
        images: [],
      },
      {
        company: "Oxford Properties Group",
        timeframe: "Mar 2020 - Aug 2020",
        logo: "/images/logos/oxford_properties_group_logo.jpeg",
        role: "Lead Integration Developer · Contract Full-time",
        achievements: [
          "Led the VTS platform implementation, designing and developing an automated data cleansing process for JDE data extracts that loads sanitised data into VTS on a nightly basis.",
          "Developed a Budget integration ingesting Azure DataMart views and performing an ETL process that populates CSV templates uploaded to SmartFile for consumption by VTS.",
          "Built an SSIS reconciliation package comparing data Oxford sent to VTS against what was entered via VTS reports, generating a comparison log that saved many hours of manual work.",
          "Updated a complex integration between Oxford's corporate website and its Space Inventory application, replacing it with VTS Portfolio data and mapping legacy indicators to allow data to flow through.",
          "Developed PowerApps applications for mapping third-party buildings in VTS with Oxford JDE properties, and for running the Budget integration on an ad-hoc basis for business users.",
        ],
        images: [],
      },
      {
        company: 'Toys"R"Us Canada',
        timeframe: "Nov 2019 - Feb 2020",
        logo: "/images/logos/toysrus_canada_logo.jpeg",
        role: "Data Developer · Contract Full-time",
        achievements: [
          "Created multiple SSIS ETL packages ingesting data from sFTP servers, MySQL, and SQL Server databases for Business Intelligence purposes.",
          "Developed back-end solutions using views, stored procedures, C#, and VB scripts to extract, transform, cleanse, and load data.",
          "Used Azure Data Factory to create data pipelines, setting up linked services and integration runtimes for both on-premises and cloud environments.",
        ],
        images: [],
      },
      {
        company: "Walmart Labs",
        timeframe: "Nov 2018 - Oct 2019",
        logo: "/images/logos/walmartglobaltech_logo.jpeg",
        role: "Data Developer & DevOps / Master Data Analyst · Contract Full-time",
        achievements: [
          "Used OneOps to manage building and deploying QA and production environments for the Metadata Management web application for the Canadian Data Lake.",
          "Developed disaster recovery processes and bash scripts to apply patches and perform backups across multiple environments.",
          "Optimised the Ecom Catalog Kafka feed supporting daily Sales reports by updating the DW Loader from fast append to reload, reducing row count.",
          "Developed Python scripts using Selenium to automate the item delisting process, translating into significant labour cost savings.",
          "Initiated monthly Vendor fines process resulting in $400,000 in fines for the first wave.",
          "Developed SQL queries across Oracle, DB2, Teradata, and SQL Server; rotational Scrum Master duties for the Data Ops team.",
        ],
        images: [],
      },
      {
        company: "Rethink Solutions Inc.",
        timeframe: "Jul 2017 - Oct 2018",
        logo: "/images/logos/rethink_solutions_inc__logo.jpeg",
        role: "Data Specialist · Permanent Full-time",
        achievements: [
          "Served as team lead in migrating current and historical data for top-ranking Fortune 500 companies, processing gigabytes of data from multiple sources with 100,000+ records and 100+ fields per dataset.",
          "Mapped unstructured client data to existing database structures, applying cleansing techniques including error corrections, unifications, outlier handling, and data enrichment to ensure integrity before load.",
          "Developed reusable SQL procedures, functions, and queries to support migration workflows and generated ad hoc reports to support internal and external decision-making.",
          "Tested and validated imported data against source systems on local web servers and databases, ensuring accuracy and completeness for each client implementation.",
        ],
        images: [],
      },
      {
        company: "Plexxis Software",
        timeframe: "Oct 2016 - Jul 2017",
        logo: "/images/logos/plexxissoftware_logo.jpeg",
        role: "Developer & Data Analyst · Permanent Full-time",
        achievements: [
          "Wrote PL/SQL queries, views, and stored procedures to automate data sanity checks and support large-scale data migration into Oracle databases.",
          "Maintained and developed new features in Oracle Forms for the ERP front end, working collaboratively with developers, project managers, account managers, and end customers.",
          "Mapped and connected multiple high-volume disparate data sources across mixed environments and platforms into common data structures, and created custom data file exports for third-party software integrations.",
          "Provided technical support to the application development team, analysing available information and applying systems knowledge to diagnose and resolve issues.",
        ],
        images: [],
      },
      {
        company: "Teknion",
        timeframe: "Sep 2011 - Oct 2016",
        logo: "/images/logos/teknion_logo.jpeg",
        role: "Systems Analyst · Permanent Full-time",
        achievements: [
          "Maintained the manufacturing system's item master, bill of materials, and routings, ensuring accuracy and completeness of all data to meet customer demand on time in coordination with Engineering, Materials, and Production.",
          "Created bills of materials and routings from detailed engineering drawings for special products, entering all component parts, BOM structures, and routing attachments in the customised item data system.",
          "Processed engineering change orders including TFS manufacturing changes across part numbers, BOMs, routings, and all related EDM processes, and maintained the existing part numbering system in the Item Master.",
          "Designed IT specifications for new custom forms, developed test case scenarios, created reference and training documentation, and delivered end-user and shop floor training on new systems and production techniques.",
          "Built custom reports in Enterprise Cyberquery (eCQ) for various departments and contributed to Lean Office process improvement initiatives.",
        ],
        images: [],
      },
      {
        company: "Teknion",
        timeframe: "Sep 2009 - Aug 2011",
        logo: "/images/logos/teknion_logo.jpeg",
        role: "Oracle Configurator Developer · Permanent Full-time",
        achievements: [
          "Developed and supported Oracle Configurator models on an ongoing basis, working closely with the Product Lifecycle Management team to create configurable models for sales and service modules including Order Management and iStore.",
          "Provided solutions and validation testing across configurator model structure, rules, and user interfaces, and assisted with the build release process as required.",
          "Collaborated across the organisation to gather accurate requirements and implement enhancements and problem resolutions.",
        ],
        images: [],
      },
      {
        company: "VMWare",
        timeframe: "May 2009 - Aug 2009",
        logo: "/images/logos/vmware_logo.jpeg",
        role: "Helpdesk Support Specialist · Contract Full-time",
        achievements: [
          "Provided first-level customer and technical support to Fortune 100 companies, filing technical support incidents through Siebel Call Center 7 and working through support entitlements.",
          "Used Oracle EBS Service Contracts and Install Base modules to determine support eligibility, verify primary licence holders, and handle renewal and expiry inquiries.",
          "Ran Discovery Reports to identify customer accounts and validate product SKUs and entitlements.",
          "Recognised for outstanding job performance and asked to mentor and train new hires shortly after joining.",
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "York University",
        description: <>Certificate, Full Stack Developer Graduated 2019.</>,
      },
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
        title: "Full Stack Engineer & CMS",
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
        images: [],
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
        title: "Enterprise Integration & Data Insights",
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
