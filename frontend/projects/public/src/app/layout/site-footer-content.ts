import type { SiteLink } from './site-link';

/** The footer: contact details, section links, member links and the bottom line. */
export interface SiteFooterContent {
  organisation: string;
  area: string;
  phone: string;
  phoneHref: string;
  email: string;
  siteLinks: SiteLink[];
  memberLinks: SiteLink[];
  copyright: string;
  managedBy: string;
}
