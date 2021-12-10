import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './change-password.page.actions';
import * as ApiAction from './change-password.api.actions';
import { UserService } from '@services/user.service';

@Injectable()
export class ChangePasswordEffects {
  /** EFFECTS */
  public change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.change),
      mergeMap(({ form }) => {
        return this.userService.changePassword(form).pipe(
          map(() => ApiAction.changeSuccessful()),
          catchError(() => of(ApiAction.changeFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService
  ) {}
}
