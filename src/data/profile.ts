export interface ProfileLink {
  label: string;
  href: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  highlight: string;
}

export interface PublicationEntry {
  title: string;
  authors: string;
  venue: string;
  type: 'Journal' | 'Conference';
}

export interface ReferenceEntry {
  name: string;
  role: string;
  organization: string;
  email: string;
}

export interface ProfileData {
  name: string;
  shortName: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
  status: string;
  aboutHeading: string;
  aboutBody: string[];
  skillGroups: SkillGroup[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  references: ReferenceEntry[];
  links: ProfileLink[];
}

export const PROFILE: ProfileData = {
  name: 'Muhammad Akmal Hakim Ahmad Asmawi',
  shortName: 'Akmal Hakim',
  role: 'Data Engineer & AI Developer',
  email: 'muhammadakmal2490@gmail.com',
  phone: '+60 18 288 2455',
  linkedin: 'https://www.linkedin.com/in/m-akmal-hakim/',
  status: 'NBDAC, DOSM · MSc IT (UiTM)',
  aboutHeading: 'About & Technical Skills',
  aboutBody: [
    'Data Engineer and AI Developer specializing in Python-driven ETL orchestration, geospatial analytics, and scalable system architecture.',
    'Bridges the gap between raw data and actionable insights by engineering pipelines and high-performance portals and systems. Experienced in integrating LLMs and machine learning to automate complex workflows and deliver agentic business intelligence.',
  ],
  skillGroups: [
    {
      category: 'Data Engineering & ETL',
      items: [
        'Python (Pandas, GeoPandas, Playwright, Selenium)',
        'SQL',
        'Dagster',
        'PostgreSQL',
      ],
    },
    {
      category: 'AI & Machine Learning',
      items: [
        'Google Gemini API',
        'Local LLMs & ChromaDB RAG',
        'Scikit-Learn (DBSCAN, Random Forest, K-Means, TF-IDF)',
      ],
    },
    {
      category: 'Web Development',
      items: [
        'React',
        'FastAPI',
        'JavaScript',
        'HTML5 & CSS3',
        'Bootstrap 5',
        'PHP',
        'Firebase',
      ],
    },
    {
      category: 'Visualisation & Languages',
      items: ['Tableau', 'Power BI', 'English', 'Bahasa Malaysia'],
    },
  ],
  education: [
    {
      degree: 'Master of Science (Information Technology)',
      institution: 'Universiti Teknologi MARA (UiTM)',
      period: 'Oct 2024 – Feb 2026',
      highlight: 'Passed with minimal correction',
    },
    {
      degree: 'Bachelor of Computer Science (Hons.)',
      institution: 'Universiti Teknologi MARA (UiTM)',
      period: 'Oct 2020 – Jan 2024',
      highlight: 'CGPA: 3.48',
    },
  ],
  publications: [
    {
      title:
        'Exploring Social Media Research Trends in Malaysia using Bibliometric Analysis and Topic Modelling',
      authors:
        'Tariq, R., Isawasan, P., Shamugam, L., Ahmad Asmawi, M. A. H., Nor Azman, N. A., & Zolkepli, I. A.',
      venue: 'EAI Endorsed Transactions on Scalable Information Systems',
      type: 'Journal',
    },
    {
      title:
        'A Data Science Approach to Exploring the Relationship Between TikTok Engagement and Revenue in Malaysia: A Case Study of the Beauty and Personal Care Sector',
      authors: 'Asmawi, M. A. H. A., Isawasan, P., Shamugam, L., & Salleh, K. A.',
      venue: 'Jurnal Online Informatika',
      type: 'Journal',
    },
    {
      title:
        'Understanding Engagement Metrics and Revenue Trends in Malaysian TikTok Shop Categories',
      authors:
        'Ahmad Asmawi, M. A. H., Isawasan, P., Shamugam, L., Savitha, K.S., Budiarto, R.',
      venue:
        '15th IEEE Symposium on Computer Applications & Industrial Electronics (IEEE Xplore)',
      type: 'Conference',
    },
    {
      title:
        'A Data Analytics Approach to Exploring the Relationship Between TikTok Engagement and Revenue in Malaysia: A Case Study on the Beauty and Personal Care Sector',
      authors:
        'Isawasan, P., Ahmad Asmawi, M. A. H., Savitha, K.S., Shamugam, L., K.A. Salleh.',
      venue:
        '10th International Conference on Computing and Informatics (ICOCI)',
      type: 'Conference',
    },
  ],
  references: [
    {
      name: 'Ts. Noradilah Adnan',
      role: 'Penolong Pengarah',
      organization: 'National Big Data Analytic Centre (NBDAC), DOSM',
      email: 'noradilah.adnan@dosm.gov.my',
    },
    {
      name: 'Ts. Dr. Pradeep Isawasan',
      role: 'Master Supervisor',
      organization: 'Universiti Teknologi MARA (UiTM)',
      email: 'pradeep@uitm.edu.my',
    },
  ],
  links: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/m-akmal-hakim/',
    },
    {
      label: 'muhammadakmal2490@gmail.com',
      href: 'mailto:muhammadakmal2490@gmail.com',
    },
    {
      label: '+60 18 288 2455',
      href: 'tel:+60182882455',
    },
  ],
};
