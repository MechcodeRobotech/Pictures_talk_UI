export interface RecentWorkItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  icon: string;
  gradient: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  usageCount: string;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export enum Tool {
  Canvas = 'canvas',
  Select = 'select',
  Shapes = 'shapes',
  Connect = 'connect',
  Pencil = 'pencil',
  Text = 'text',
  Icons = 'icons',
  Images = 'images',
  Templates = 'templates',
}

export type Theme = 'light' | 'dark';
export type Lang = 'en' | 'th';
