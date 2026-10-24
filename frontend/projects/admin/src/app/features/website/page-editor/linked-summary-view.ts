/** What a linked section's summary shows: the count sentence, the first items, or why there are none (L2-REQ-124). */
export interface LinkedSummaryView {
  title: string;
  items: string[];
  empty: string;
  linkLabel: string;
  linkPath: string;
}
