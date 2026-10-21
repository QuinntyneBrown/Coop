import { IconName } from 'components';

export interface SidebarLink {
  path: string;
  label: string;
  icon: IconName;
  testId: string;
}
