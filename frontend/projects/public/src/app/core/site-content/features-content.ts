import type { HomeSectionBase } from './home-section-base';
import type { FeatureRow } from './feature-row';

/** The "Our building" and "Our community" rows. */
export interface FeaturesContent extends HomeSectionBase<'features'> {
  rows: FeatureRow[];
}
