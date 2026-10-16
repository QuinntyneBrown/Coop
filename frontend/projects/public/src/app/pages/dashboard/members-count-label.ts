/**
 * The Members figure on the dashboard. The signed-in member is one of the
 * members, so the figure is never below 1, even when the list is empty or
 * could not be loaded.
 */
export function membersCountLabel(listed: number): string {
  return String(Math.max(listed, 1));
}
