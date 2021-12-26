import { Injectable } from '@angular/core';
import { LocalStorageKeyConstant } from '@constants/core/local-storage-key.constant';
import { AcademicYear } from '@models/core/academic-year.model';
import { CommonInfoModel } from '@models/core/common-info.model';
import { StorageTimeoutModel } from '@models/core/storage-timeout.model';
import { BaseDataService } from './base-data.service';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LocalDataService extends BaseDataService {
  constructor(private readonly localStorageService: LocalStorageService) {
    super();
  }

  /** Academic year */
  public getAcademicYear(): AcademicYear | null {
    const json = this.localStorageService.getItemWithType<
      StorageTimeoutModel<AcademicYear>
    >(LocalStorageKeyConstant.ACADEMIC_YEAR);

    if (json) {
      const cache = StorageTimeoutModel.fromObject(json);
      if (cache.isValid()) {
        return cache.data;
      }
      this.localStorageService.removeItem(
        LocalStorageKeyConstant.ACADEMIC_YEAR
      );
    }

    return null;
  }

  public setAcademicYear(academicYear: AcademicYear): void {
    this.localStorageService.setItem(
      LocalStorageKeyConstant.ACADEMIC_YEAR,
      JSON.stringify(new StorageTimeoutModel(academicYear))
    );
  }

  /** School year */
  public getCommonInfo(): CommonInfoModel | null {
    const json = this.localStorageService.getItemWithType<
      StorageTimeoutModel<CommonInfoModel>
    >(LocalStorageKeyConstant.COMMON_INFO);

    if (json) {
      const cache = StorageTimeoutModel.fromObject(json);
      if (cache.isValid()) {
        return cache.data;
      }
      this.localStorageService.removeItem(LocalStorageKeyConstant.COMMON_INFO);
    }

    return null;
  }

  public setCommonInfo(commonInfo?: CommonInfoModel): void {
    if (!commonInfo) {
      return;
    }

    this.localStorageService.setItem(
      LocalStorageKeyConstant.COMMON_INFO,
      JSON.stringify(new StorageTimeoutModel(commonInfo))
    );
  }
}