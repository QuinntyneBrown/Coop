import type { HomeSectionBase } from './home-section-base';
/** The head of "What's on" and its message when no notice is published. */
export interface NoticesContent extends HomeSectionBase<'notices'> {
  eyebrow: string;
  title: string;
  lead: string;
  emptyMessage: string;
}
