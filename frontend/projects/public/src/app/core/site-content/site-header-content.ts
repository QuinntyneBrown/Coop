import type { SiteLink } from './site-link';

/** The header on every public page. */
export interface SiteHeaderContent {
  siteName: string;
  siteSubtitle: string;
  /** The menu links; the website pages follow them. */
  menuLinks: SiteLink[];
  signInLink: SiteLink;
  /** The visit button in the phone menu. */
  visitLink: SiteLink;
}
