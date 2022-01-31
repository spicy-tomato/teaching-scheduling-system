import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AppService } from '@services/core/app.service';
import { LocalStorageService } from '@services/core/storage/local-storage.service';
import { UserService } from '@services/user.service';
import { LocalStorageKeyConstant } from '@shared/constants';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Teacher } from '../models';

@Injectable()
export class UserInfoResolve implements Resolve<Teacher | undefined> {
  /** CONSTRUCTOR */
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly localStorageService: LocalStorageService
  ) {}

  /** IMPLEMENTATIONS */
  public resolve(): Observable<Teacher | undefined> | undefined {
    const hasAccessToken = !!this.localStorageService.getItem(
      LocalStorageKeyConstant.ACCESS_TOKEN
    );
    if (!hasAccessToken) {
      this.appService.redirectToLogin();
      return undefined;
    }

    return this.userService.me().pipe(
      map(
        (teacher) => {
          if (!teacher) throw Error();
          return teacher;
        },
        catchError(() => {
          this.appService.redirectToLogin();
          return of(undefined);
        })
      )
    );
  }
}
