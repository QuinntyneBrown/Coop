import type { SiteFooterContent } from './site-footer-content';
import type { SiteLink } from './site-link';

/** Copy shared by the site header and footer on every public page. */
export interface SiteContent {
  siteName: string;
  siteSubtitle: string;
  /** The home page section links; the website pages follow them in the header. */
  navigation: SiteLink[];
  footer: SiteFooterContent;
}
