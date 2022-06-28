import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './login.page.actions';
import * as ApiAction from './login.api.actions';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  reset,
  keepLogin,
  AppShellState,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  AccessTokenService,
  AppService,
  AuthService,
} from '@teaching-scheduling-system/web/shared/data-access/services';

@Injectable()
export class LoginEffects {
  /** EFFECTS */
  public login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.clickLogin),
      mergeMap(({ loginForm }) => {
        return this.authService.auth(loginForm).pipe(
          map(({ token, teacher }) => {
            if (token === '' || !teacher) {
              return ApiAction.systemError();
            }

            this.accessTokenService.save(token);
            return ApiAction.loginSuccessful({ teacher });
          }),
          catchError((e) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            e.status === 401
              ? of(ApiAction.wrongPassword())
              : of(ApiAction.systemError())
          )
        );
      })
    );
  });

  public loginSuccessful$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ApiAction.loginSuccessful),
        mergeMap(() =>
          of({}).pipe(
            tap(() => {
              this.appShellStore.dispatch(reset());
              this.appShellStore.dispatch(keepLogin());
              this.appService.redirectToApp(
                this.route.snapshot.queryParamMap.get('redirect')
              );
            })
          )
        )
      );
    },
    { dispatch: false }
  );

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly route: ActivatedRoute,
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly accessTokenService: AccessTokenService,
    private readonly appShellStore: Store<AppShellState>
  ) {}
}
