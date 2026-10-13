import type { LandingPhoto } from './landing-photo';

/** A building or community row: a photograph beside a checklist. */
export interface LandingFeature {
  eyebrow: string;
  title: string;
  items: string[];
  photo: LandingPhoto;
  flip: boolean;
}
