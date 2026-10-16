/** Up to two capital initials from a sender's name, e.g. "Tavi Moss" -> "TM". */
export function senderInitials(name: string | null | undefined): string {
  const words = (name ?? '').split(/[\s._-]+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}
