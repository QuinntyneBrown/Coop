/**
 * Turns a code name such as "SystemAdministrator" or "MaintenanceRequest" into
 * plain words for people: "System administrator", "Maintenance request".
 */
export function plainName(code: string | null | undefined): string {
  const words = (code ?? '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
