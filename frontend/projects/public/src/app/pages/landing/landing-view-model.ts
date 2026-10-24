import type { BoardMemberView } from './board-member-view';
import type { NoticeView } from './notice-view';

type Json = Record<string, unknown> | null | undefined;

const text = (source: Json, ...keys: string[]): string => {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

const boardMemberFrom = (raw: unknown): BoardMemberView | null => {
  if (!raw || typeof raw !== 'object') return null;
  const member = raw as Record<string, unknown>;
  const name = text(member, 'name', 'Name', 'fullname', 'Fullname');
  if (!name) return null;
  const avatarUrl = text(member, 'avatarUrl', 'AvatarUrl', 'photoUrl');
  return {
    name,
    title: text(member, 'title', 'Title', 'role', 'Role', 'boardTitle') || 'Board member',
    initials: initialsOf(name),
    ...(avatarUrl ? { avatarUrl } : {}),
  };
};

/** The directors of `GET api/board-of-directors` (`{ directors }`), in the board's order (L2-REQ-124 AC6). */
export function directorsFrom(response: unknown): BoardMemberView[] {
  const list = (response as Record<string, unknown> | null)?.['directors'];
  return Array.isArray(list)
    ? list.map(boardMemberFrom).filter((m): m is BoardMemberView => m !== null)
    : [];
}

/** Plain-text excerpt cut at a word boundary, with HTML tags removed. */
export function excerptOf(source: string, max = 140): string {
  const plain = source
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  const atWord = cut.lastIndexOf(' ');
  return `${(atWord > max / 2 ? cut.slice(0, atWord) : cut).replace(/[,;:.]$/, '')}…`;
}

const TORONTO = 'America/Toronto';

/** Map a published notice to the card the "What's on" block shows. */
export function noticeViewFrom(raw: unknown): NoticeView | null {
  if (!raw || typeof raw !== 'object') return null;
  const notice = raw as Record<string, unknown>;
  const title = text(notice, 'title', 'Title', 'name', 'Name');
  if (!title) return null;
  const created = text(notice, 'createdOn', 'CreatedOn', 'createdAt', 'CreatedAt');
  const date = created ? new Date(created) : null;
  const valid = date !== null && !Number.isNaN(date.getTime());
  const part = (options: Intl.DateTimeFormatOptions) =>
    valid ? new Intl.DateTimeFormat('en-CA', { timeZone: TORONTO, ...options }).format(date) : '';
  return {
    id: text(notice, 'documentId', 'DocumentId', 'id', 'Id') || title,
    title,
    excerpt: excerptOf(text(notice, 'body', 'Body', 'content', 'Content', 'description')),
    day: part({ day: 'numeric' }),
    month: part({ month: 'short' }),
    dateLabel: part({ weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }),
    dateTime: valid ? date.toISOString() : '',
  };
}
