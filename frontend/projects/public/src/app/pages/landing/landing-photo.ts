/** A photograph on the home page: path under `public/own/`, description and intrinsic size. */
export interface LandingPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  layout?: 'wide' | 'tall' | 'small';
}
