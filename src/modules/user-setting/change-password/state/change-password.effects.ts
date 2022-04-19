import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './change-password.page.actions';
import * as ApiAction from './change-password.api.actions';
import { UserService } from '@services/user.service';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';

@Injectable()
export class ChangePasswordEffects {
  /** PRIVATE PROPERTIES */
  private readonly teacher$ = this.appShellStore.pipe(
    fromAppShell.selectNotNullTeacher
  );

  /** EFFECTS */
  public change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.change),
      withLatestFrom(this.teacher$),
      mergeMap(([{ form }, teacher]) => {
        return this.userService.changePassword(teacher.uuid, form).pipe(
          map(() => ApiAction.changeSuccessful()),
          catchError(() => of(ApiAction.changeFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {}
}
