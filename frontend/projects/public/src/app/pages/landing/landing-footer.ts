import type { LandingLink } from './landing-link';

/** The footer: contact details, section links, member links and the bottom line. */
export interface LandingFooter {
  organisation: string;
  area: string;
  phone: string;
  phoneHref: string;
  email: string;
  siteLinks: LandingLink[];
  memberLinks: LandingLink[];
  copyright: string;
  managedBy: string;
}
