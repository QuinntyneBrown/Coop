import { SidebarLink } from './sidebar-link';

/** A run of related sidebar links, with a heading above it except for the first and last groups. */
export interface SidebarGroup {
  heading?: string;
  links: SidebarLink[];
}
