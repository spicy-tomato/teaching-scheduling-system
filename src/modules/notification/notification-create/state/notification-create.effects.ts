import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as PageAction from "./notification-create.page.actions";
import * as ApiAction from "./notification-create.api.actions";
import { catchError, debounceTime, exhaustMap, map } from "rxjs/operators";
import { of } from "rxjs";
import { isEmpty } from 'lodash';
import { NotificationService } from "@services/notification.service";

@Injectable()
export class NotificationCreateEffects {
  public submit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.clickConfirm),
      debounceTime(300),
      exhaustMap(({ value, errors }) => {
        if (!isEmpty(errors)) {
          return of(ApiAction.invalidForm({ errors }));
        }

        return this.notificationService
          .createModuleNotification(value)
          .pipe(
            map(() => ApiAction.submitSuccessful()),
            catchError(() => of(ApiAction.submitFailure()))
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private notificationService: NotificationService
  ) { }
}
