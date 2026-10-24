import type { ContentRecord } from '../../../core/models/content-record';

/** The value at a dotted path such as `home.hero` or `sections.2`. */
export function readPath(root: ContentRecord, path: string): ContentRecord {
  if (!path) return root;
  return path.split('.').reduce((node, key) => node?.[key], root) ?? {};
}

/** A copy of the content with the value at a dotted path replaced; a numeric key steps into a list. */
export function writePath<T extends ContentRecord>(root: T, path: string, value: unknown): T {
  if (!path) return value as T;
  const [key, ...rest] = path.split('.');
  const next = rest.length ? writePath(root[key] ?? {}, rest.join('.'), value) : value;
  if (Array.isArray(root)) {
    const copy = [...root] as unknown as T & unknown[];
    copy[Number(key)] = next;
    return copy as T;
  }
  return { ...root, [key]: next };
}
