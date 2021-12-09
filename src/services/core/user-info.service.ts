import { Injectable } from '@angular/core';
import { LocalStorageKeyConstant } from '@constants/local-storage-key.constant';
import { Teacher } from '@models/core/teacher.model';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  public get(): Teacher | undefined {
    const savedInfo = this.localStorageService.getItem(
      LocalStorageKeyConstant.userInfo
    );

    return savedInfo ? (JSON.parse(savedInfo) as Teacher) : undefined;
  }

  public set(userInfo: Teacher): void {
    this.localStorageService.setItem(
      LocalStorageKeyConstant.userInfo,
      JSON.stringify(userInfo)
    );
  }

  public clear(): void {
    this.localStorageService.removeItem(LocalStorageKeyConstant.userInfo);
  }
}
