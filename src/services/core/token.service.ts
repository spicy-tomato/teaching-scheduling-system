import { Injectable } from '@angular/core';
import { LocalStorageKeyConstant } from '@constants/local-storage-key.constant';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  public get(): string | null {
    return this.localStorageService.getItem(
      LocalStorageKeyConstant.accessToken
    );
  }

  public set(token: string): void {
    this.localStorageService.setItem(
      LocalStorageKeyConstant.accessToken,
      token
    );
  }

  public clear(): void {
    this.localStorageService.removeItem(
      LocalStorageKeyConstant.accessToken
    );
  }
}
