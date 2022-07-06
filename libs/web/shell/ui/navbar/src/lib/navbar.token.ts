import { InjectionToken, ValueProvider } from '@angular/core';

export interface NavbarOptions {
  readonly showInfo: boolean;
}

const NAVBAR_DEFAULT_OPTIONS: NavbarOptions = {
  showInfo: true,
};

export const NAVBAR_OPTIONS = new InjectionToken('navbar', {
  factory: () => NAVBAR_DEFAULT_OPTIONS,
});

export const navbarOptionsProvider: (
  options: Partial<NavbarOptions>
) => ValueProvider = (options: Partial<NavbarOptions>) => ({
  provide: NAVBAR_OPTIONS,
  useValue: { ...NAVBAR_DEFAULT_OPTIONS, ...options },
});
