import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { of } from "rxjs";
import { delay, exhaustMap, map, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as PageAction from "./login.page.actions";
import * as ApiAction from "./login.api.actions";

@Injectable()
export class LoginEffects {
  public login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.clickLogin),
      delay(1000),
      exhaustMap(({ loginForm }) =>
        of(loginForm)
          .pipe(
            map(x => x.password === '123'
              ? ApiAction.loginSuccessful({ name: x.email })
              : ApiAction.loginFailure())
          )
      )
    );
  });

  public loginSuccessful$ = createEffect(() => {
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

  constructor(
    private actions$: Actions,
    private router: Router
  ) { }
}
