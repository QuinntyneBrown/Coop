export const PHOTO_UNAVAILABLE_SRC = '/own/photo-unavailable.svg';

/**
 * Replaces a photograph that fails to load, for example one whose asset was
 * deleted, with the built-in "Photo not available" image (L2-REQ-097 AC5).
 */
export function showPhotoUnavailable(event: Event): void {
  const image = event.target as HTMLImageElement;
  if (image.src.endsWith(PHOTO_UNAVAILABLE_SRC)) return;
  image.src = PHOTO_UNAVAILABLE_SRC;
  image.alt = 'Photo not available';
}
