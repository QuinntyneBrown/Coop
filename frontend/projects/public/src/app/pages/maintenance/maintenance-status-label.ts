/** Plain words a member sees for a request's status: New, Received, Started or Done. */
export function maintenanceStatusLabel(status: string | null | undefined): string {
  const s = (status || 'New').toLowerCase();
  if (s === 'started' || s.includes('progress')) return 'Started';
  if (s === 'done' || s === 'completed' || s === 'complete' || s === 'closed') return 'Done';
  if (s === 'received') return 'Received';
  return 'New';
}
