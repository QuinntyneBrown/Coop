import type { HomeSectionKind } from './home-section-kind';

/** What every home page section carries besides its own values (L2-REQ-122, ADR 0021). */
export interface HomeSectionBase<K extends HomeSectionKind> {
  kind: K;
  /** True keeps the section out of the public page while its values are kept. */
  hidden?: boolean;
}
