import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { of } from "rxjs";
import { delay, exhaustMap, map, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as PageActions from "./login.page.actions";
import * as ApiActions from "./login.api.actions";

@Injectable()
export class LoginEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageActions.clickLogin),
      exhaustMap(({ loginForm }) =>
        of(loginForm)
          .pipe(
            delay(1000),
            map(x => x.password === '123'
              ? ApiActions.loginSuccessful({ name: x.email })
              : ApiActions.loginFailure())
          )
      )
    );
  });

  loginSuccessful$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiActions.loginSuccessful),
      exhaustMap(() =>
        of({}).pipe(
          tap(() => {
            this.router.navigate(['']);
          })
        )
      )
    );
  },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router
  ) { }
}
