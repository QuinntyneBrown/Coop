const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Why a chosen file cannot be uploaded as a photo, or null when it can (L2-REQ-097 AC1). */
export function photoFileError(file: { type: string; size: number }): string | null {
  if (!PHOTO_TYPES.includes(file.type)) return 'Choose a JPEG, PNG or WebP photo.';
  if (file.size > MAX_PHOTO_BYTES) return 'Choose a photo smaller than 10 MB.';
  return null;
}
