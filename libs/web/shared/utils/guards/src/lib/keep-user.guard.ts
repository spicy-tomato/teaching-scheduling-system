import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageKeyConstant } from '@teaching-scheduling-system/core/data-access/constants';
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

      console.log('guard');
      this.appService.redirectToLogin(path);
      return false;
    }

    if (!isLoginPath) {
      return true;
    }

    this.appService.redirectToApp();
    return false;
  }
}
