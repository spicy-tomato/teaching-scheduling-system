import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageKeyConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  APP_CONFIG,
  AppConfig,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  AppService,
  LocalStorageService,
} from '@teaching-scheduling-system/web/shared/data-access/services';

@Injectable({
  providedIn: 'root',
})
export class KeepUserGuard implements CanActivate {
  /** CONSTRUCTOR */
  constructor(
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly appService: AppService,
    private readonly localStorageService: LocalStorageService
  ) {}

  /** IMPLEMENTATIONS */
  public canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const path = state.url;
    const isLoginPath = path.includes('login');
    const hasAccessToken = !!this.localStorageService.getItem(
      LocalStorageKeyConstant.ACCESS_TOKEN
    );

    if (!hasAccessToken) {
      if (isLoginPath) {
        return true;
      }

      this.appService.redirectToLogin(path);
      return false;
    }

    // If have access token
    if (!isLoginPath || this.config.maintenance) {
      return true;
    }

    this.appService.redirectToApp();
    return false;
  }
}
