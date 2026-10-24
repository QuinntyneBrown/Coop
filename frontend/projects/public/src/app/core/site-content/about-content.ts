import type { HomeSectionBase } from './home-section-base';
import type { ValueCard } from './value-card';

/** The "Who we are" block. */
export interface AboutContent extends HomeSectionBase<'about'> {
  eyebrow: string;
  title: string;
  lead: string;
  values: ValueCard[];
}
