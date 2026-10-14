import type { HomeContent } from './home-content';
import type { SiteFooterContent } from './site-footer-content';
import type { SiteHeaderContent } from './site-header-content';

/** The header, footer and home page content published from the admin app (L2-REQ-094). */
export interface SiteContent {
  header: SiteHeaderContent;
  footer: SiteFooterContent;
  home: HomeContent;
}
