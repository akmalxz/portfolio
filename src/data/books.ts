import type { BookEntry, ShelfDefinition } from '../types/library';
import experienceData from './experience.json';
import projectsData from './projects.json';

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
  ...(projectsData as BookEntry[]),
  ...(experienceData as BookEntry[]),
];
