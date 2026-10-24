/** Shows a size in bytes in plain units, for example "2 KB" or "1.5 MB". */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || bytes < 0) return 'Size unknown';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} MB`;
}
