import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  GenericState,
  ResetPassword,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { UserService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  setLoader,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { filter, of, switchMap, tap } from 'rxjs';

type ConfirmState = GenericState<EApiStatus>;

@Injectable()
export class ConfirmStore extends ComponentStore<ConfirmState> {
  // PUBLIC PROPERTIES 
  readonly status$ = this.select((s) => s.status);
  readonly validateStatus$ = this.select((s) => s.data);

  // EFFECTS 
  readonly verifyToken = this.effect<{
    email: string | null;
    token: string | null;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ data: 'loading' })),
      switchMap(({ email, token }) => {
        if (!email || !token) {
          this.navigateToRequest();
          return of();
        }

        return this.userService.verifyResetPassword({ email, token }).pipe(
          tapResponse(
            () =>
              this.patchState({
                data: 'successful',
                error: '',
              }),
            () => this.navigateToRequest()
          )
        );
      })
    )
  );

  readonly reset = this.effect<{ data: ResetPassword }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap(({ data }) =>
        this.userService.resetPassword(data).pipe(
          tapResponse(
            () =>
              this.patchState({
                status: 'successful',
                error: '',
              }),
            (error) =>
              this.patchState({
                status: 'systemError',
                error: error as string,
              })
          )
        )
      )
    )
  );

  // CONSTRUCTOR 
  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ConfirmState>{});
    this.handleVerifyDone();
  }

  // PRIVATE METHODS 
  private navigateToRequest(): void {
    void this.router.navigate(['reset-password/request'], {
      state: { validationFailed: true },
    });
  }

  private handleVerifyDone(): void {
    this.validateStatus$
      .pipe(
        filter((status) => status === 'successful'),
        tap(() => this.appShellStore.dispatch(setLoader({ showLoader: false })))
      )
      .subscribe();
  }
}
