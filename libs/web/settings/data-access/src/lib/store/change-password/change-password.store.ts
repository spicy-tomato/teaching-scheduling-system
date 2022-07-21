import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import {
  ChangePassword,
  GenericState,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { UserService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';

type ExamState = GenericState<void>;

@Injectable()
export class SettingsChangePasswordStore extends ComponentStore<ExamState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);
  private readonly teacher$ = this.appShellStore.pipe(selectNotNullTeacher);

  /** EFFECTS */
  public readonly change = this.effect<{ form: ChangePassword }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      withLatestFrom(this.teacher$),
      switchMap(([params, teacher]) =>
        this.userService.changePassword(teacher.uuidAccount, params.form).pipe(
          tapResponse(
            () =>
              this.patchState({
                status: 'successful',
                error: '',
              }),
            (error) =>
              this.patchState({
                status: 'clientError',
                error: error as string,
              })
          )
        )
      )
    )
  );

  /** CONSTRUCTOR */
  constructor(
    private readonly userService: UserService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ExamState>{});
  }
}
