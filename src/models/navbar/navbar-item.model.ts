interface NavbarItem {
  key: string;
  label?: string;
  routerLink?: string;
  icon?: string;
}

export interface NavbarGroup {
  items: NavbarItem[];
}
