import type { BookEntry, ShelfDefinition } from '../types/library';

export const SHELVES: ShelfDefinition[] = [
  {
    id: 'shelf-projects',
    category: 'project',
    label: 'Key Projects',
    description: 'ETL pipelines, RAG systems & analytics platforms',
  },
  {
    id: 'shelf-experience',
    category: 'experience',
    label: 'Work Experience',
    description: 'Data engineering & quantitative ML research',
  },
];

export const BOOKS: BookEntry[] = [
  // Shelf 1: Key Projects (5 volumes)
  {
    id: 'proj-demographics',
    metrics: [
      { value: '22M+', label: 'records indexed' },
      { value: '<300ms', label: 'API latency' },
      { value: '40%', label: 'faster SQL' },
    ],
    pipeline: [
      { stage: '22M+ Raw Records', detail: 'National Census Source' },
      { stage: 'PostgreSQL Index', detail: 'Composite B-Tree Schema' },
      { stage: 'FastAPI Engine', detail: '<300ms REST Breakdowns' },
      { stage: 'AI Subset Filter', detail: '<2s Targeted Extraction' },
    ],
    tradeoff: {
      bottleneck:
        'Unindexed queries and heavy API payloads stalled demographic breakdowns across 22M+ national records.',
      decision:
        'Engineered composite PostgreSQL indexes and stripped extraneous serialization fields — cutting SQL query time by 40% and achieving sub-300ms API latency.',
    },
    category: 'project',
    spineTitle: 'Demographics 22M',
    title: 'Demographics Profiling Dashboard',
    subtitle: 'Large-Scale National Analytics · PostgreSQL & FastAPI',
    period: 'Oct 2026',
    summary:
      'High-throughput national demographics analytics platform serving 22M+ records with sub-300ms API latency and rapid AI data filtering.',
    highlights: [
      'Migrated and indexed a schema of over 22M national records in PostgreSQL to power large-scale analytics.',
      'Engineered FastAPI REST endpoints to serve complex data breakdowns with sub-300ms latency.',
      'Optimized backend processes by stripping extraneous features and improved SQL query performance by 40%.',
      'Built backend logic for AI data filtering, extracting targeted subsets from 22M records in <2 seconds.',
    ],
    tags: ['PostgreSQL', 'FastAPI', 'Python', 'SQL Optimization', 'AI Filtering'],
    tone: 'cobalt',
    height: 'tall',
    thickness: 'regular',
    callNumber: 'PRJ·01',
  },
  {
    id: 'proj-plan-ai',
    metrics: [
      { value: '32B', label: 'param local LLM' },
      { value: '2030', label: 'sprawl forecast' },
      { value: 'RAG', label: 'legal auditing' },
    ],
    pipeline: [
      { stage: 'Sentinel-2 + OSM', detail: 'Satellite & Vector APIs' },
      { stage: 'Python Geo-ETL', detail: 'Ecological Metric Compute' },
      { stage: 'ChromaDB + 32B LLM', detail: 'Spatial Legal RAG Audit' },
      { stage: 'React Forecast UI', detail: '2030 Urban Sprawl Map' },
    ],
    tradeoff: {
      bottleneck:
        'Manual legal auditing of satellite land-use data could not scale or project long-horizon urban sprawl.',
      decision:
        'Coupled Sentinel-2 and OSM spatial pipelines with a local 32B-parameter LLM over ChromaDB RAG to autonomously audit compliance and forecast 2030 sprawl.',
    },
    category: 'project',
    spineTitle: 'Plan-AI 2026',
    title: 'Plan-AI Hackathon 2026',
    subtitle: 'Geospatial RAG & Urban Sprawl Forecasting',
    period: 'Aug 2026',
    summary:
      'End-to-end geospatial intelligence pipeline combining satellite imagery, local 32B LLM legal auditing, and predictive 2030 urban sprawl forecasts.',
    highlights: [
      'Engineered a Python pipeline processing Sentinel-2 imagery and live OSM APIs to compute ecological metrics.',
      'Built a ChromaDB RAG system integrating a 32B-parameter local LLM to autonomously audit spatial legal compliance.',
      'Architected automated JSON reports and predictive 2030 urban sprawl forecasts delivered to a React dashboard.',
    ],
    tags: ['Python', 'Sentinel-2', 'OSM API', 'ChromaDB RAG', '32B Local LLM', 'React'],
    tone: 'teal',
    height: 'medium',
    thickness: 'thick',
    callNumber: 'PRJ·02',
  },
  {
    id: 'proj-rag-chatbot',
    metrics: [
      { value: 'Hours → secs', label: 'report retrieval' },
      { value: '100%', label: 'data integrity' },
    ],
    pipeline: [
      { stage: 'Normalized DBs', detail: 'Multi-Table Enterprise SQL' },
      { stage: 'Denormalized Layer', detail: 'Zero-Hallucination Context' },
      { stage: 'Gemini RAG Engine', detail: 'NL-to-Insight Synthesis' },
      { stage: 'Executive BI View', detail: 'Hours → Seconds Delivery' },
    ],
    tradeoff: {
      bottleneck:
        'Direct LLM querying across normalized relational schemas caused join hallucinations and hours of manual verification.',
      decision:
        'Denormalized target tables into deterministic context views for Gemini RAG — guaranteeing 100% data integrity and shrinking retrieval from hours to seconds.',
    },
    category: 'project',
    spineTitle: 'AI Chatbot (RAG)',
    title: 'AI Chatbot (RAG)',
    subtitle: 'Gemini-Powered Natural Language BI Assistant',
    period: 'Mar 2026',
    summary:
      'Enterprise conversational analytics assistant enabling stakeholders to query complex databases and generate visual insights with zero hallucinations.',
    highlights: [
      'Developed a Gemini-powered AI virtual assistant for stakeholders to query complex databases and generate visual insights using natural language.',
      'Conducted data denormalization to structure raw context and eliminate AI hallucinations with 100% data integrity.',
      'Reduced executive data retrieval and reporting time from hours to mere seconds.',
    ],
    tags: ['Google Gemini API', 'RAG', 'Data Denormalization', 'SQL', 'Python'],
    tone: 'indigo',
    height: 'tall',
    thickness: 'regular',
    callNumber: 'PRJ·03',
  },
  {
    id: 'proj-banci-ekonomi',
    metrics: [
      { value: '90%', label: 'less processing time' },
      { value: '100%', label: 'totals preserved' },
    ],
    pipeline: [
      { stage: 'Raw Survey Feeds', detail: 'Multi-Stage DOSM Inputs' },
      { stage: 'Pandas Cleansing', detail: 'Automated Schema Checks' },
      { stage: 'Reconciliation Gate', detail: '100% Totals Validation' },
      { stage: 'Publication Output', detail: '90% Faster Release' },
    ],
    tradeoff: {
      bottleneck:
        'Multi-day manual spreadsheet cleaning and cross-tabulation risked human error across national economic census tables.',
      decision:
        'Automated end-to-end cleaning, validation, and aggregation in Python/Pandas — slashing processing time by 90% while preserving 100% of statistical totals.',
    },
    category: 'project',
    spineTitle: 'Banci Ekonomi',
    title: 'Banci Ekonomi (BE) Publication Automation',
    subtitle: 'Statistical Publication Pipeline · DOSM',
    period: 'Nov 2025',
    summary:
      'Automated multi-stage statistical publication pipeline that compressed multi-day manual data workflows into minutes with 100% statistical accuracy.',
    highlights: [
      'Led automation of a multi-stage statistical publication pipeline including cleaning, validation, and aggregation.',
      'Slashed publication processing time by up to 90%.',
      'Transformed multi-day manual tasks into minutes while preserving 100% of statistical totals.',
    ],
    tags: ['Python', 'Pandas', 'ETL Automation', 'Data Validation'],
    tone: 'ice',
    height: 'short',
    thickness: 'thin',
    callNumber: 'PRJ·04',
  },
  {
    id: 'proj-datathon-judging',
    metrics: [
      { value: 'Real-time', label: 'live leaderboard' },
      { value: '0', label: 'race conditions' },
    ],
    pipeline: [
      { stage: 'Multi-Judge Inputs', detail: 'Concurrent Score Submits' },
      { stage: 'LockService Mutex', detail: 'Race-Condition Guard' },
      { stage: 'Auto-Tabulation', detail: 'Atomic Score Pipeline' },
      { stage: 'Live Leaderboard', detail: 'Zero-Error Sync UI' },
    ],
    tradeoff: {
      bottleneck:
        'Simultaneous score submissions from multiple judges caused database write collisions and stale leaderboard states.',
      decision:
        'Enforced mutex serialization via LockService around atomic score tabulation — eliminating race conditions for an instant, zero-error live leaderboard.',
    },
    category: 'project',
    spineTitle: 'Datathon Judging',
    title: 'Datathon 2025 Judging System (MDIT x DOSM)',
    subtitle: 'Real-Time Concurrent Evaluation & Leaderboard Platform',
    period: 'Aug 2025',
    summary:
      'Concurrency-safe real-time scoring architecture synchronizing multi-judge evaluations into an instant, race-condition-free live leaderboard.',
    highlights: [
      'Served as Lead Developer in architecting a real-time scoring system for MDIT x DOSM.',
      'Engineered pipelines to process concurrent evaluations from multiple judges, ensuring seamless real-time data synchronization.',
      'Utilized LockService to prevent database race conditions, completely automating score tabulation to deliver an instant, error-free leaderboard.',
    ],
    tags: ['Real-Time Sync', 'Concurrency Control', 'LockService', 'JavaScript'],
    tone: 'violet',
    height: 'medium',
    thickness: 'regular',
    callNumber: 'PRJ·05',
  },

  // Shelf 2: Professional Experience (2 volumes)
  {
    id: 'exp-nbdac-dosm',
    metrics: [
      { value: '10K+', label: 'records / week' },
      { value: '95%', label: 'extraction success' },
      { value: '40+ hrs', label: 'saved monthly' },
    ],
    pipeline: [
      { stage: '10K+ Weekly Feeds', detail: 'Multi-Source Ingestion' },
      { stage: 'Dagster + GeoPandas', detail: '95% Automated Spatial ETL' },
      { stage: 'PostgreSQL + LLM', detail: '200K-Row Context Store' },
      { stage: 'National BI Portal', detail: '40+ Hrs Saved Monthly' },
    ],
    tradeoff: {
      bottleneck:
        'Fragmented manual scripts required 40+ hours of monthly intervention and struggled with regional geospatial joins.',
      decision:
        'Orchestrated Dagster ETL pipelines with GeoPandas and PostgreSQL — reaching a 95% weekly extraction success rate and powering a 200K-row real-time dashboard.',
    },
    category: 'experience',
    spineTitle: 'NBDAC · DOSM',
    title: 'Personel MySTEP — Data Engineer & AI Developer',
    subtitle: 'National Big Data Analytic Centre (NBDAC), DOSM',
    period: 'Apr 2025 – Current',
    summary:
      'Architecting national-scale Dagster ETL pipelines, geospatial transformations, real-time PostgreSQL analytics dashboards, and LLM dataset workflows.',
    highlights: [
      'Architected automated ETL pipelines and processes via Dagster.',
      'Achieved a 95% success rate extracting 10,000+ weekly records.',
      'Managed a centralized data repository, eliminating 40+ hours of manual processing monthly.',
      'Conducted geospatial data transformations using Pandas and GeoPandas for regional analysis.',
      'Built a real-time analytic dashboard processing 200,000+ records directly from PostgreSQL.',
      'Integrated LLM models to retrieve, process, and elaborate on raw dataset context.',
      'Authored comprehensive technical documentation for all engineered data systems.',
    ],
    tags: ['Dagster', 'Python', 'Pandas', 'GeoPandas', 'PostgreSQL', 'LLMs'],
    tone: 'charcoal',
    height: 'tall',
    thickness: 'thick',
    callNumber: 'EXP·01',
  },
  {
    id: 'exp-utp-researcher',
    metrics: [
      { value: '5,000', label: 'datasets analysed' },
      { value: '2', label: 'papers & proposals' },
    ],
    pipeline: [
      { stage: '5,000 MOOC Datasets', detail: 'Secondary Learning Logs' },
      { stage: 'Python Feature Eng', detail: 'Custom Evaluation Pipeline' },
      { stage: 'RF & K-Means ML', detail: 'Scikit-Learn Clustering' },
      { stage: '2 Papers & Grants', detail: 'Published Findings' },
    ],
    tradeoff: {
      bottleneck:
        'High-dimensional learner behavior across 5,000 secondary MOOC datasets obscured completion and engagement drivers.',
      decision:
        'Combined unsupervised K-Means segmentation with Random Forest feature importance in Scikit-Learn — grounding 2 peer-reviewed publications and grant proposals.',
    },
    category: 'experience',
    spineTitle: 'Researcher · UTP',
    title: 'Researcher',
    subtitle: 'Universiti Teknologi PETRONAS (UTP)',
    period: 'Nov 2024 – Apr 2025',
    summary:
      'Quantitative machine learning research on digital learning trends across large MOOC datasets, producing academic publications and grant proposals.',
    highlights: [
      'Conducted quantitative research on digital learning trends across 5,000 secondary datasets.',
      'Designed custom Python methodologies to evaluate complex MOOC datasets.',
      'Developed and trained machine learning models including Random Forest and K-Means clustering.',
      'Authored 2 academic papers and proposals, including grant funding.',
    ],
    tags: ['Python', 'Scikit-Learn', 'Random Forest', 'K-Means', 'Quantitative Research'],
    tone: 'mint',
    height: 'medium',
    thickness: 'thick',
    callNumber: 'EXP·02',
  },
];
