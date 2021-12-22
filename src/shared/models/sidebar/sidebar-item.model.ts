export interface SidebarItem {
  name: string;
  icon?: string;
  routerLink?: string;
  subItems?: {
    name: string;
    routerLink: string;
  }[];
  permission?: number;
}
