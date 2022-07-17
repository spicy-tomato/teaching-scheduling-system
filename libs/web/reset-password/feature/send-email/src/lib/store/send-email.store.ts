import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { GenericState } from '@teaching-scheduling-system/web/shared/data-access/models';
import { UserService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { switchMap, tap } from 'rxjs';

type SendEmailState = GenericState<void>;

@Injectable()
export class SendEmailStore extends ComponentStore<SendEmailState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  public readonly requestResetPassword = this.effect<{
    email: string;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap(({ email }) =>
        this.userService.requestResetPassword(email).pipe(
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
  constructor(private readonly userService: UserService) {
    super(<SendEmailState>{});
  }
}
