import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  GenericState,
  ResetPassword,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { UserService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { of, switchMap, tap } from 'rxjs';

type ConfirmState = GenericState<EApiStatus>;

@Injectable()
export class ConfirmStore extends ComponentStore<ConfirmState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);
  public readonly validateStatus$ = this.select((s) => s.data);

  /** EFFECTS */
  public readonly verifyToken = this.effect<{
    email: string | null;
    token: string | null;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ data: EApiStatus.loading })),
      switchMap(({ email, token }) => {
        if (!email || !token) {
          this.navigateToRequest();
          return of();
        }

        return this.userService.verifyResetPassword({ email, token }).pipe(
          tapResponse(
            () =>
              this.patchState({
                data: EApiStatus.successful,
                error: '',
              }),
            () => this.navigateToRequest()
          )
        );
      })
    )
  );

  public readonly reset = this.effect<{ data: ResetPassword }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: EApiStatus.loading, error: null })),
      switchMap(({ data }) =>
        this.userService.resetPassword(data).pipe(
          tapResponse(
            () =>
              this.patchState({
                status: EApiStatus.successful,
                error: '',
              }),
            (error) =>
              this.patchState({
                status: EApiStatus.systemError,
                error: error as string,
              })
          )
        )
      )
    )
  );

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    super(<ConfirmState>{});
  }

  /** PRIVATE METHODS */
  private navigateToRequest(): void {
    void this.router.navigate(['reset-password/request'], {
      state: { validationFailed: true },
    });
  }
}
