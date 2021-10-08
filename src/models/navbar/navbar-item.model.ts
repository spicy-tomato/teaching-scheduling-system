export interface NavbarItem {
  label?: string,
  items: {
    label?: string,
    routerLink:
    string,
    icon?: string;
  }[];
}
