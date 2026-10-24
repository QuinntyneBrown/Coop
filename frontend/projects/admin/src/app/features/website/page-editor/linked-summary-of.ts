import { APP_PATHS } from '../../../core/app-paths';
import type { LinkedSectionKind } from '../fields/linked-section-kind';
import type { LinkedSummaryView } from './linked-summary-view';

/** A published notice or a director as the summary lists it. */
export interface LinkedItem {
  name: string;
  detail: string;
}

const AT_MOST = 5;

/**
 * The sentence and items of a linked section's summary (L2-REQ-124 AC1 to
 * AC4): "What visitors will see: 3 published notices, newest first" with the
 * first five, or why nothing shows and where to add items.
 */
export function linkedSummaryOf(
  kind: LinkedSectionKind,
  items: LinkedItem[] | null,
): LinkedSummaryView {
  const notices = kind === 'notices';
  const linkLabel = notices ? 'Manage notices' : 'Manage directors';
  const linkPath = notices ? APP_PATHS.documents : APP_PATHS.websiteBoard;
  if (items === null) {
    return {
      title: 'What visitors will see:',
      items: [],
      empty: "We couldn't count them right now.",
      linkLabel,
      linkPath,
    };
  }
  if (items.length === 0) {
    return {
      title: notices
        ? 'What visitors will see: no published notices'
        : 'What visitors will see: no directors yet',
      items: [],
      empty: notices
        ? 'Your message above shows instead. Publish a notice under Documents and it appears here.'
        : 'The section shows its title only. Add directors under Board of directors and they appear here.',
      linkLabel,
      linkPath,
    };
  }
  const n = items.length;
  return {
    title: notices
      ? `What visitors will see: ${n} published ${n === 1 ? 'notice' : 'notices'}, newest first`
      : `What visitors will see: ${n} ${n === 1 ? 'director' : 'directors'}, in this order`,
    items: items
      .slice(0, AT_MOST)
      .map((item) => `${item.name}${notices ? ' · ' : ', '}${item.detail}`),
    empty: '',
    linkLabel,
    linkPath,
  };
}
