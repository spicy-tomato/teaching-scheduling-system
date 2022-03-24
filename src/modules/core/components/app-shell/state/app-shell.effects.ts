import { Injectable } from '@angular/core';
import * as PageAction from './app-shell.page.actions';
import * as ApiAction from './app-shell.api.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { AccessTokenService } from '@services/core/access-token.service';
import { UserService } from '@services/user.service';
import { CommonInfoService } from '@services/common-info.service';
import { AppService } from '@services/core/app.service';

@Injectable()
export class AppShellEffects {
  /** EFFECTS */
  public keepLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.keepLogin),
      mergeMap(() => {
        return this.userService.me().pipe(
          map((response) => response.data),
          map((teacher) =>
            teacher
              ? ApiAction.autoLoginSuccessfully({ teacher })
              : ApiAction.autoLoginFailure()
          ),
          catchError(() => of(ApiAction.autoLoginFailure()))
        );
      })
    );
  });

  public autoLoginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ApiAction.autoLoginFailure),
        mergeMap(() =>
          of({}).pipe(
            tap(() => {
              this.accessTokenService.clear();
              this.appService.redirectToLogin();
            })
          )
        )
      );
    },
    { dispatch: false }
  );

  public loadRooms$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.autoLoginSuccessfully),
      mergeMap(() => {
        return this.commonInfoService.getRooms().pipe(
          map((rooms) => ApiAction.loadRoomsSuccessfully({ rooms })),
          catchError(() => of(ApiAction.loadRoomsFailure()))
        );
      })
    );
  });

  public loadSchoolYear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.autoLoginSuccessfully),
      mergeMap(() => {
        return this.commonInfoService
          .getCurrentTerm()
          .pipe(
            map((currentTerm) =>
              ApiAction.loadCurrentTermSuccessful({ currentTerm })
            )
          );
      })
    );
  });

  public loadAcademicYear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.autoLoginSuccessfully),
      mergeMap(() => {
        return this.commonInfoService.getAcademicYear().pipe(
          map((academicYears) =>
            ApiAction.loadAcademicYearSuccessful({ academicYears })
          ),
          catchError(() => of(ApiAction.loadAcademicYearFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly commonInfoService: CommonInfoService,
    private readonly accessTokenService: AccessTokenService
  ) {}
}
