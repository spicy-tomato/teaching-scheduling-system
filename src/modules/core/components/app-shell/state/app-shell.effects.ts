import { Injectable } from '@angular/core';
import * as PageAction from './app-shell.page.actions';
import * as ApiAction from './app-shell.api.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { AccessTokenService } from '@services/core/access-token.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@services/user.service';
import { Teacher } from 'src/shared/models';
import { CommonInfoService } from '@services/common-info.service';
import { AppService } from '@services/core/app.service';

@Injectable()
export class AppShellEffects {
  /** EFFECTS */
  public autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.tryAutoLogin),
      mergeMap(() => {
        const cachedTeacher = this.route.snapshot.data['userInfo'] as Teacher;
        if (cachedTeacher) {
          return of(
            ApiAction.autoLoginSuccessfully({ teacher: cachedTeacher })
          );
        }

        return this.userService.me().pipe(
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

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly route: ActivatedRoute,
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly commonInfoService: CommonInfoService,
    private readonly accessTokenService: AccessTokenService
  ) {}
}
