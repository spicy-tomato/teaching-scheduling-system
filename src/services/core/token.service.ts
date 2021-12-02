import { Injectable } from '@angular/core';
import { SessionStorageKeyConstant } from '@constants/session-storage-key.constants';
import { SessionStorageService } from './storage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private readonly sessionStorageService: SessionStorageService) {}

  public set(token: string): void {
    this.sessionStorageService.setItem(
      SessionStorageKeyConstant.accessToken,
      token
    );
  }

  public clear(): void {
    this.sessionStorageService.removeItem(
      SessionStorageKeyConstant.accessToken
    );
  }
}
