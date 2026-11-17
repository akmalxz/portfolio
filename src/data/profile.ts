import contactData from './contact.json';
import educationData from './education.json';
import publicationsData from './publications.json';
import skillsData from './skills.json';

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
  thesisTitle?: string;
  thesisUrl?: string;
}

export interface PublicationEntry {
  title: string;
  authors: string;
  venue: string;
  type: 'Journal' | 'Conference';
  url?: string;
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
  avatarUrl?: string;
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
  ...skillsData,
  ...contactData,
  education: educationData,
  publications: publicationsData as PublicationEntry[],
};
