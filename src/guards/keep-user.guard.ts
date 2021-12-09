import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { SessionStorageService } from '@services/core/storage/session-storage.service';
import { LocalStorageKeyConstant } from '@constants/local-storage-key.constant';

@Injectable({
  providedIn: 'root',
})
export class KeepUserGuard implements CanLoad {
  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly sessionStorageService: SessionStorageService
  ) {}

  /** IMPLEMENTATIONS */
  public canLoad(): boolean {
    const hasAccessToken = !!this.sessionStorageService.getItem(
      LocalStorageKeyConstant.accessToken
    );
    if (!hasAccessToken) {
      return true;
    }

    void this.router.navigate(['/']);
    return false;
  }
}
