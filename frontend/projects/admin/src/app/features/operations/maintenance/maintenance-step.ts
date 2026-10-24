/** The next lifecycle step the office can take on a maintenance request. */
export interface MaintenanceStep {
  action: 'receive' | 'start' | 'complete';
  label: string;
  testId: string;
}
