import type { HomeSectionBase } from './home-section-base';
import type { GalleryPhoto } from './gallery-photo';

/** The "A look around" gallery. */
export interface GalleryContent extends HomeSectionBase<'gallery'> {
  eyebrow: string;
  title: string;
  photos: GalleryPhoto[];
}
