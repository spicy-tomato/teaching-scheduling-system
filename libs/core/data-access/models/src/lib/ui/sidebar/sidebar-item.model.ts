export interface SidebarItem {
  name: string;
  icon: string;
  routerLink?: string;
  subItems?: {
    name: string;
    routerLink: string;
    icon: string;
    useTaigaIcon?: boolean;
  }[];
  subCheckboxes?: {
    controlName: string;
    name: string;
  }[];
  permission?: number;
  useTaigaIcon?: boolean;
  externalLink?: string;
  exactRouterLink?: boolean;
  controlName?: string;
}
