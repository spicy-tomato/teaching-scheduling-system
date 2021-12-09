import { Injectable } from '@angular/core';
import * as PageAction from './app-shell.page.actions';
import * as ApiAction from './app-shell.api.actions';
import { mergeMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { TokenService } from '@services/core/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher } from '@models/core/teacher.model';

@Injectable()
export class AppShellEffects {
  /** EFFECTS */
  public autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.tryAutoLogin),
      mergeMap(() => {
        const teacher = this.route.snapshot.data['userInfo'] as Teacher;

        if (!teacher) {
          return of(ApiAction.autoLoginFailure());
        }

        return of(ApiAction.autoLoginSuccessfully({ teacher }));
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
              this.tokenService.clear();
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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) {}
}
