import { IconName } from '../shared/components/icon-name';

export interface SidebarLink {
  path: string;
  label: string;
  icon: IconName;
  testId: string;
}
