import type { SitePhoto } from './site-photo';

/** One "A look around" photograph. */
export interface GalleryPhoto {
  photo: SitePhoto;
  caption: string;
  size: 'wide' | 'tall' | 'small';
}
