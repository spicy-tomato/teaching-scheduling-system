import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './feedback.page.actions';
import * as ApiAction from './feedback.api.actions';
import { UserService } from '@services/user.service';

@Injectable()
export class FeedbackEffects {
  /** EFFECTS */
  public submit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.submit),
      mergeMap(({ form }) => {
        return this.userService.sendFeedback(form).pipe(
          map(() => ApiAction.submitSuccessful()),
          catchError(() => of(ApiAction.submitFailure()))
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
