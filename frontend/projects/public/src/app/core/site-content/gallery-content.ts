import type { GalleryPhoto } from './gallery-photo';

/** The "A look around" gallery. */
export interface GalleryContent {
  eyebrow: string;
  title: string;
  photos: GalleryPhoto[];
}
