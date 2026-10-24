import { MaintenanceStep } from './maintenance-step';

/**
 * Returns the one step the office can take next (New, Received, Started,
 * Completed), or null once the request is completed. The API enforces the
 * same order; this only decides which button to show.
 */
export function nextMaintenanceStep(
  status: string | number | null | undefined,
): MaintenanceStep | null {
  switch (String(status ?? 'New').toLowerCase()) {
    case 'new':
    case 'created':
    case '0':
      return { action: 'receive', label: 'Receive Request', testId: 'maintenance-receive-button' };
    case 'received':
    case '1':
      return { action: 'start', label: 'Start work', testId: 'maintenance-start-button' };
    case 'started':
    case 'inprogress':
    case '2':
      return { action: 'complete', label: 'Finish work', testId: 'maintenance-finish-button' };
    default:
      return null;
  }
}
