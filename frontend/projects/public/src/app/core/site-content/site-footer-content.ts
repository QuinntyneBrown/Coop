import type { SiteLink } from './site-link';

/** The footer on every public page: contact details, two link lists and the bottom line. */
export interface SiteFooterContent {
  contactHeading: string;
  organisation: string;
  area: string;
  phone: string;
  email: string;
  siteLinksHeading: string;
  siteLinks: SiteLink[];
  memberLinksHeading: string;
  memberLinks: SiteLink[];
  copyright: string;
  websiteLine: string;
}
