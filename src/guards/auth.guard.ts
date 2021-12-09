import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionStorageKeyConstant } from 'src/shared/constants/session-storage-key.constants';
import { SessionStorageService } from '@services/core/storage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly sessionStorageService: SessionStorageService
  ) {}

  /** IMPLEMENTATIONS */
  public canActivate(): boolean {
    const hasAccessToken = !!this.sessionStorageService.getItem(
      SessionStorageKeyConstant.accessToken
    );
    if (hasAccessToken) {
      return true;
    }

    void this.router.navigate(['/login']);
    return false;
  }
}
