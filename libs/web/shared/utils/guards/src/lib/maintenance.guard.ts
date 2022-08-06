import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceGuard implements CanActivate {
  // CONSTRUCTOR
  constructor(
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly router: Router
  ) {}

  // IMPLEMENTATIONS
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (route.url[0]?.path === 'maintenance' && !this.config.maintenance) {
      void this.router.navigate(['/']);
      return false;
    }
    if (route.url[0]?.path !== 'maintenance' && this.config.maintenance) {
      void this.router.navigate(['/maintenance']);
      return false;
    }

    return true;
  }
}
