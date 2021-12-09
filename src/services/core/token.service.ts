import { Injectable } from '@angular/core';
import { SessionStorageKeyConstant } from 'src/shared/constants/session-storage-key.constants';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  public get(): string | null {
    return this.localStorageService.getItem(
      SessionStorageKeyConstant.accessToken
    );
  }

  public set(token: string): void {
    this.localStorageService.setItem(
      SessionStorageKeyConstant.accessToken,
      token
    );
  }

  public clear(): void {
    this.localStorageService.removeItem(
      SessionStorageKeyConstant.accessToken
    );
  }
}
