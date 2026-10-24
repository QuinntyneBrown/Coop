import type { HomeSectionBase } from './home-section-base';
import type { SiteLink } from './site-link';

/** The "Visit or apply" band. */
export interface VisitContent extends HomeSectionBase<'visit'> {
  eyebrow: string;
  title: string;
  lead: string;
  phone: string;
  hours: string;
  action: SiteLink;
}
