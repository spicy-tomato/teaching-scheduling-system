import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { GoogleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNameTitle,
  selectNotNullTeacher,
  setConnectToGoogle,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  combineLatest,
  filter,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

type ExamState = {
  code: string;
  authStatus: EApiStatus;
  revokeStatus: EApiStatus;
  error: Nullable<string>;
};

@Injectable()
export class SettingsShellStore extends ComponentStore<ExamState> {
  // PUBLIC PROPERTIES
  readonly authStatus$ = this.select((s) => s.authStatus);
  readonly revokeStatus$ = this.select((s) => s.revokeStatus);
  readonly error$ = this.select((s) => s.error);
  readonly nameTitle$ = this.appShellStore
    .select(selectNameTitle)
    .pipe(takeUntil(this.destroy$));
  readonly teacher$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    takeUntil(this.destroy$)
  );

  // PRIVATE PROPERTIES
  private readonly data$ = this.select((s) => s.code);

  // EFFECTS
  readonly authenticate = this.effect((params$) =>
    params$.pipe(
      tap(() => this.patchState({ authStatus: 'loading', error: null })),
      withLatestFrom(this.teacher$),
      switchMap(({ 1: { uuidAccount } }) =>
        this.googleService.authenticate(uuidAccount).pipe(
          tapResponse(
            ({ data }) => {
              document.location.href = data.authUrl;
            },
            (error) =>
              this.patchState({
                authStatus: 'clientError',
                error: error as string,
              })
          )
        )
      )
    )
  );

  readonly revoke = this.effect((params$) =>
    params$.pipe(
      tap(() => this.patchState({ revokeStatus: 'loading', error: null })),
      withLatestFrom(this.teacher$),
      switchMap(({ 1: { uuidAccount } }) =>
        this.googleService.revoke(uuidAccount).pipe(
          tapResponse(
            () => {
              this.patchState({ revokeStatus: 'successful' });
              this.appShellStore.dispatch(
                setConnectToGoogle({ connect: false })
              );
            },
            (error) =>
              this.patchState({
                revokeStatus: 'clientError',
                error: error as string,
              })
          )
        )
      )
    )
  );

  // CONSTRUCTOR
  constructor(
    private readonly googleService: GoogleService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ExamState>{});
    this.handleAuthorize();
  }

  // PUBLIC METHODS
  authorize(code: string): void {
    this.patchState({ code, error: null });
  }

  // PRIVATE METHODS
  private handleAuthorize(): void {
    combineLatest([this.data$, this.teacher$])
      .pipe(
        ObservableHelper.filterNullishProp([0, 1]),
        filter(({ 1: teacher }) => !teacher.settings.googleCalendar),
        tap(() => this.patchState({ authStatus: 'loading', error: null })),
        switchMap(([code, { uuidAccount }]) => {
          return this.googleService.authorize(uuidAccount, code).pipe(
            tapResponse(
              () => {
                this.patchState({ authStatus: 'successful' });
                this.appShellStore.dispatch(
                  setConnectToGoogle({ connect: true })
                );
              },
              () => {
                this.patchState({
                  authStatus: 'clientError',
                  error: 'Mã xác thực không hợp lệ, vui lòng thử lại!',
                });
              }
            )
          );
        })
      )
      .subscribe();
  }
}
