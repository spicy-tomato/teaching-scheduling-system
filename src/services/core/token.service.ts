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
      LocalStorageKeyConstant.ACCESS_TOKEN
    );
  }

  public save(token: string): void {
    this.localStorageService.setItem(
      LocalStorageKeyConstant.ACCESS_TOKEN,
      token
    );
  }

  public clear(): void {
    this.localStorageService.removeItem(LocalStorageKeyConstant.ACCESS_TOKEN);
  }
}
