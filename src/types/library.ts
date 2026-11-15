export type ShelfCategory = 'project' | 'experience';

export type SpineTone =
  | 'cobalt'
  | 'indigo'
  | 'teal'
  | 'slate'
  | 'charcoal'
  | 'violet'
  | 'ice'
  | 'mint';

export type SpineHeight = 'short' | 'medium' | 'tall';

export type SpineThickness = 'thin' | 'regular' | 'thick';

export interface BookLink {
  label: string;
  href: string;
}

export interface BookMetric {
  /** Headline figure, e.g. "22M+" or "90%" */
  value: string;
  /** Short caption under the figure */
  label: string;
}

export interface BookEntry {
  /** 2–3 headline impact figures surfaced above the details */
  metrics?: BookMetric[];
  id: string;
  category: ShelfCategory;
  /** Short title printed on the spine */
  spineTitle: string;
  /** Full title shown in the reading card */
  title: string;
  /** Role, company, or short project subtitle */
  subtitle: string;
  /** Year or date range, e.g. "2025" or "2023 — Present" */
  period: string;
  /** Brief description inside the open reading card */
  summary: string;
  /** Bullet highlights */
  highlights: string[];
  /** Technologies, tools, or focus areas */
  tags: string[];
  links?: BookLink[];
  /** Visual spine customization */
  tone: SpineTone;
  height?: SpineHeight;
  thickness?: SpineThickness;
  /** Subtle library catalog number on the spine */
  callNumber: string;
}

export interface ShelfDefinition {
  id: string;
  category: ShelfCategory;
  label: string;
  description: string;
}
