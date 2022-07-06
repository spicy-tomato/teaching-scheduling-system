interface NavbarItem {
  key: string;
  label?: string;
  routerLink?: string;
  icon: string;
  externalLink?: string;
}

export interface NavbarGroup {
  items: NavbarItem[];
}
