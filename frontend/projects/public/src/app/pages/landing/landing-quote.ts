import type { LandingPhoto } from './landing-photo';

/** The "a word from a member" block. */
export interface LandingQuote {
  text: string;
  attribution: string;
  photo: LandingPhoto;
}
