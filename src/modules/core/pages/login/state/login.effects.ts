import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import {
  catchError,
  delay,
  exhaustMap,
  map,
  mergeMap,
  tap,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './login.page.actions';
import * as ApiAction from './login.api.actions';
import { AuthService } from '@services/core/auth.service';
import { TokenService } from '@services/core/token.service';

@Injectable()
export class LoginEffects {
  /** EFFECTS */
  public login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.clickLogin),
      delay(1000),
      mergeMap(({ loginForm }) => {
        return this.authService.auth(loginForm).pipe(
          map(({ token, teacher }) => {
            this.tokenService.set(token);
            return ApiAction.loginSuccessful({ teacher });
          }),
          catchError(() => of(ApiAction.loginFailure()))
        );
      })
    );
  });

  public loginSuccessful$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ApiAction.loginSuccessful),
        exhaustMap(() =>
          of({}).pipe(
            tap(() => {
              void this.router.navigate(['']);
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
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}
}
