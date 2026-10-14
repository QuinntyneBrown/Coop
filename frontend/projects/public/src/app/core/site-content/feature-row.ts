import type { SitePhoto } from './site-photo';

/** A photograph beside a checklist; rows alternate sides by position. */
export interface FeatureRow {
  eyebrow: string;
  title: string;
  items: string[];
  photo: SitePhoto;
}
