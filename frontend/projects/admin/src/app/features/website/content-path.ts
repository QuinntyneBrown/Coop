import type { ContentRecord } from '../../core/models/content-record';

/** The value at a dotted path such as `home.hero`. */
export function readPath(root: ContentRecord, path: string): ContentRecord {
  return path.split('.').reduce((node, key) => node?.[key], root) ?? {};
}

/** A copy of the content with the value at a dotted path replaced. */
export function writePath<T extends ContentRecord>(root: T, path: string, value: unknown): T {
  const [key, ...rest] = path.split('.');
  return {
    ...root,
    [key]: rest.length ? writePath(root[key] ?? {}, rest.join('.'), value) : value,
  };
}
