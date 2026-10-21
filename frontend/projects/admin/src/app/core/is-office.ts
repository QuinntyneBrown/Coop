import { OFFICE_ROLES } from './office-roles';

/** True when the user, as `GET api/user/current` returns them, holds an office role. */
export function isOffice(user: { roles?: { name?: string }[] } | null | undefined): boolean {
  return (user?.roles ?? []).some((role) => OFFICE_ROLES.includes(role.name ?? ''));
}
