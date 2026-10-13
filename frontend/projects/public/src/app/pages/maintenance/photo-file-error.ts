/** Largest photo the API accepts (10 MB). */
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/** Photo types the API accepts. */
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Plain-words reason a chosen file cannot be sent as a photo, or null when
 * it can. The API applies the same rules; this only saves a round trip.
 */
export function photoFileError(file: { name: string; type: string; size: number }): string | null {
  if (!PHOTO_TYPES.includes(file.type)) {
    return `“${file.name}” is not a photo we can use. Choose a JPEG, PNG or WebP photo.`;
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return `“${file.name}” is too large. Choose a photo smaller than 10 MB.`;
  }
  return null;
}
