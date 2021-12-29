import { Injectable } from '@angular/core';
import { LocalStorageKeyConstant } from '@constants/core/local-storage-key.constant';
import { AcademicYear, Nullable, StorageTimeoutModel } from 'src/shared/models';
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
  public getAcademicYear(): Nullable<AcademicYear> {
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
  public getCurrentTerm(): Nullable<string> {
    const json = this.localStorageService.getItemWithType<
      StorageTimeoutModel<string>
    >(LocalStorageKeyConstant.CURRENT_TERM);

    if (json) {
      const cache = StorageTimeoutModel.fromObject(json);
      if (cache.isValid()) {
        return cache.data;
      }
      this.localStorageService.removeItem(LocalStorageKeyConstant.CURRENT_TERM);
    }

    return null;
  }

  public setCurrentTerm(commonInfo?: string): void {
    if (!commonInfo) {
      return;
    }

    this.localStorageService.setItem(
      LocalStorageKeyConstant.CURRENT_TERM,
      JSON.stringify(
        new StorageTimeoutModel(
          commonInfo,
          LocalStorageKeyConstant.LONG_TIMEOUT
        )
      )
    );
  }
}
