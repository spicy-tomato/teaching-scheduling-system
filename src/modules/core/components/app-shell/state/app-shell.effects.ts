import { Injectable } from '@angular/core';
import * as PageAction from './app-shell.page.actions';
import * as ApiAction from './app-shell.api.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { TokenService } from '@services/core/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher } from '@models/core/teacher.model';
import { UserService } from '@services/user.service';

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
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}
}
