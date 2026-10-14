import type { ContentRecord } from './content-record';

/** The header, footer and home page content of the public site (`/site-content`, L2-REQ-097). */
export interface SiteContent {
  header: ContentRecord;
  footer: ContentRecord;
  home: ContentRecord;
}
