import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as PageAction from "./notification-create.page.actions";
import * as ApiAction from "./notification-create.api.actions";
import { debounceTime, exhaustMap, map } from "rxjs/operators";
import { of } from "rxjs";
import { ValidationErrors } from "@angular/forms";
import { isEmpty } from 'lodash';

@Injectable()
export class NotificationCreateEffects {
  public submit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.clickConfirm),
      debounceTime(300),
      exhaustMap(({ form }) => {
        const errors = Object.keys(form.controls)
          .reduce((acc: ValidationErrors, key) => {
            if (form.controls[key].errors) {
              acc[key] = form.controls[key].errors;
            }
            return acc;
          }, {});

        return of(errors)
          .pipe(
            map(e => isEmpty(e)
              ? ApiAction.validForm(form.value)
              : ApiAction.invalidForm({ errors })
            )
          );
      })
    );
  });

  // public invalidForm$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(ApiAction.invalidForm),
  //     operator(() => EMPTY));
  // }, { dispatch: false });

  constructor(
    private actions$: Actions,
  ) { }
}
