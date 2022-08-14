import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { LoginForm } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AccessTokenService,
  AppService,
  AuthService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  keepLogin,
  reset,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, tap } from 'rxjs';

type LoginState = {
  status: EApiStatus;
};

@Injectable()
export class LoginStore extends ComponentStore<LoginState> {
  // PROPERTIES
  readonly status$ = this.select((s) => s.status);

  // EFFECTS
  readonly login = this.effect<LoginForm>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading' })),
      switchMap((form) =>
        this.authService.auth(form).pipe(
          tapResponse(
            ({ token, teacher }) => {
              if (token === '' || !teacher) {
                this.patchState({ status: 'systemError' });
              }

              this.accessTokenService.save(token);
              this.patchState({ status: 'successful' });
              this.appShellStore.dispatch(reset());
              this.appShellStore.dispatch(keepLogin());
              this.appService.redirectToApp(
                this.route.snapshot.queryParamMap.get('redirect')
              );
            },
            (e: HttpErrorResponse) =>
              this.patchState({
                status: e.status === 401 ? 'clientError' : 'systemError',
              })
          )
        )
      )
    )
  );

  // CONSTRUCTOR
  constructor(
    private readonly route: ActivatedRoute,
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly accessTokenService: AccessTokenService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super({ status: 'unknown' });
  }
}
