import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { LocalStorageKeyConstant } from '@constants/core/local-storage-key.constant';
import { LocalStorageService } from '@services/core/storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class KeepUserGuard implements CanLoad {
  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService
  ) {}

  /** IMPLEMENTATIONS */
  public canLoad(): boolean {
    const hasAccessToken = !!this.localStorageService.getItem(
      LocalStorageKeyConstant.ACCESS_TOKEN
    );
    if (!hasAccessToken) {
      return true;
    }

    void this.router.navigate(['/']);
    return false;
  }
}
