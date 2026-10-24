import type { SiteContent } from './site-content';

/** The content the office edits (`GET /site-content?draft=true`, L2-REQ-121 AC3): the draft when one exists, else the published copy. */
export interface SiteContentDraft {
  siteContent: SiteContent;
  /** True when `siteContent` is the unpublished draft. */
  hasDraft: boolean;
}
