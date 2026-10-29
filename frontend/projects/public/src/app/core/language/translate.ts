import type { SiteLanguage } from './site-language';

/**
 * The content in a language (L2-REQ-131 AC4, ADR 0023): in French, each
 * object's non-empty French text, from its `fr` object, replaces the English
 * value of the same name, and a non-empty French list of texts replaces an
 * English list; anything else keeps the English. Every `fr` object is left
 * out of the result.
 */
export function translate<T>(value: T, language: SiteLanguage): T {
  if (Array.isArray(value)) return value.map((item) => translate(item, language)) as T;
  if (value === null || typeof value !== 'object') return value;
  const { fr, ...english } = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(english)) result[key] = translate(item, language);
  if (language === 'fr' && fr !== null && typeof fr === 'object' && !Array.isArray(fr)) {
    for (const [key, french] of Object.entries(fr as Record<string, unknown>)) {
      if (typeof result[key] === 'string' && typeof french === 'string' && french.trim()) {
        result[key] = french;
      } else if (Array.isArray(result[key]) && isTextList(french)) {
        result[key] = french;
      }
    }
  }
  return result as T;
}

function isTextList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === 'string' && item.trim())
  );
}
