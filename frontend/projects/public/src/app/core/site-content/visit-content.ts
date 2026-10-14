import type { SiteLink } from './site-link';

/** The "Visit or apply" band. */
export interface VisitContent {
  eyebrow: string;
  title: string;
  lead: string;
  phone: string;
  hours: string;
  action: SiteLink;
}
