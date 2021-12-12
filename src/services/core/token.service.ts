import { Injectable } from '@angular/core';
import { LocalStorageKeyConstant } from '@constants/core/local-storage-key.constant';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  /** CONSTRUCTOR */
  constructor(private readonly localStorageService: LocalStorageService) {}

  /** PUBLIC METHODS */
  public get(): string | null {
    return this.localStorageService.getItem(
      LocalStorageKeyConstant.accessToken
    );
  }

  public save(token: string): void {
    this.localStorageService.setItem(
      LocalStorageKeyConstant.accessToken,
      token
    );
  }

  public clear(): void {
    this.localStorageService.removeItem(LocalStorageKeyConstant.accessToken);
  }
}
