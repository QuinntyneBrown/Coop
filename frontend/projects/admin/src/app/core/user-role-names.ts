/**
 * The names of a user's roles, as the API returns them: `roles` is a list of
 * role objects. Several roles are listed with commas.
 */
export function userRoleNames(user: { roles?: { name?: string }[] } | null | undefined): string {
  return (user?.roles ?? [])
    .map((role) => role.name)
    .filter((name) => !!name)
    .join(', ');
}
