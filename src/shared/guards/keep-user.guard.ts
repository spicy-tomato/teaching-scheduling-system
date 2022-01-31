import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageKeyConstant } from '@shared/constants';
import { LocalStorageService } from '@services/core/storage/local-storage.service';
import { AppService } from '@services/core/app.service';

@Injectable({
  providedIn: 'root',
})
export class KeepUserGuard implements CanActivate {
  /** CONSTRUCTOR */
  constructor(
    private readonly appService: AppService,
    private readonly localStorageService: LocalStorageService
  ) {}

  /** IMPLEMENTATIONS */
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoginPath = route.routeConfig?.path === 'login';
    const hasAccessToken = !!this.localStorageService.getItem(
      LocalStorageKeyConstant.ACCESS_TOKEN
    );

    if (!hasAccessToken) {
      if (isLoginPath) {
        return true;
      }

      this.appService.redirectToLogin(state.url);
      return false;
    }

    if (!isLoginPath) {
      return true;
    }

    this.appService.redirectToApp();
    return false;
  }
}
