import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { BaseComponent } from '@modules/core/base/base.component';

import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromLogin from './state';
import { LoginForm } from '@models/login/login-form.model';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { slideUp } from 'src/shared/animations/slide-up.animation';
import { Md5 } from 'ts-md5';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [slideUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public status$: Observable<EApiStatus>;
  public readonly submit$ = new Subject<void>();
  public readonly loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });
  public readonly LoginStatus = EApiStatus;

  /** GETTERS */
  public get username(): AbstractControl | null {
    return this.loginForm.get('username');
  }

  public get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromLogin.LoginState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    this.status$ = store
      .select(fromLogin.selectState)
      .pipe(takeUntil(this.destroy$));

    this.handleLoginFailed();
    this.handleSubmit();
  }

  /** PRIVATE METHODS */
  private handleLoginFailed(): void {
    this.status$
      .pipe(
        filter(
          (status) =>
            status === this.LoginStatus.clientError ||
            status === this.LoginStatus.systemError
        ),
        mergeMap((status) => {
          const label =
            status === this.LoginStatus.clientError
              ? 'Thông tin đăng nhập không chính xác!'
              : 'Lỗi hệ thống!';
          return this.notificationsService.show('Hãy thử lại', {
            label,
            status: TuiNotification.Error,
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSubmit(): void {
    this.submit$
      .pipe(
        debounceTime(300),
        tap(() => {
          const username = this.username?.value as string;
          const password = this.password?.value as string;

          const loginForm: LoginForm = {
            username,
            password: new Md5().appendStr(password).end() as string,
          };
          this.store.dispatch(fromLogin.clickLogin({ loginForm }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
