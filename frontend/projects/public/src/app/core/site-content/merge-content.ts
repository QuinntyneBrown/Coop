/**
 * Lays published content over the built-in defaults value by value
 * (L2-REQ-098 AC3): a published string, even an empty one, wins; a published
 * positive number wins; a published list replaces the default list; any
 * missing or malformed value takes the default.
 */
export function mergeContent<T>(defaults: T, published: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(published) ? published : defaults) as T;
  }
  if (defaults !== null && typeof defaults === 'object') {
    const source =
      published !== null && typeof published === 'object' && !Array.isArray(published)
        ? (published as Record<string, unknown>)
        : {};
    const merged: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(defaults)) {
      merged[key] = mergeContent(value, source[key]);
    }
    return merged as T;
  }
  if (typeof defaults === 'string') {
    return (typeof published === 'string' ? published : defaults) as T;
  }
  if (typeof defaults === 'number') {
    return (typeof published === 'number' && published > 0 ? published : defaults) as T;
  }
  return defaults;
}
