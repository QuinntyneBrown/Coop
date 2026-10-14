import type { ValueCard } from './value-card';

/** The "Who we are" block. */
export interface AboutContent {
  eyebrow: string;
  title: string;
  lead: string;
  values: ValueCard[];
}
