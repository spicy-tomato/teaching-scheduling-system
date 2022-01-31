import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { BaseComponent } from '@modules/core/base/base.component';

import { Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromLogin from './state';
import { EApiStatus } from '@shared/enums';
import { slideUp } from '@shared/animations';
import { Md5 } from 'ts-md5';
import { LoginForm } from 'src/shared/models';
import { TuiInputPasswordComponent } from '@taiga-ui/kit';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [slideUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent {
  /** VIEWCHILD */
  @ViewChild(TuiInputPasswordComponent, { static: true })
  public passwordComponent!: TuiInputPasswordComponent;

  /** PUBLIC PROPERTIES */
  public status$: Observable<EApiStatus>;
  public readonly submit$ = new Subject();
  public readonly loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });
  public readonly EApiStatus = EApiStatus;

  /** GETTERS */
  public get username(): AbstractControl {
    return this.loginForm.controls['username'];
  }

  public get password(): AbstractControl {
    return this.loginForm.controls['password'];
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromLogin.LoginState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    store.dispatch(fromLogin.reset());

    this.status$ = store
      .select(fromLogin.selectState)
      .pipe(takeUntil(this.destroy$));

    this.handleStatusChange();
    this.handleLoginFailed();
    this.handleSubmit();
  }

  /** PRIVATE METHODS */
  private handleStatusChange(): void {
    this.status$
      .pipe(
        map(
          (status) =>
            status === EApiStatus.loading || status === EApiStatus.successful
        ),
        distinctUntilChanged(),
        tap((disable) => {
          if (disable) {
            this.username.disable();
            this.password.disable();
          } else {
            this.username.enable();
            this.password.enable();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleLoginFailed(): void {
    this.status$
      .pipe(
        filter(
          (status) =>
            status === EApiStatus.clientError ||
            status === EApiStatus.systemError
        ),
        mergeMap((status) => {
          const label =
            status === EApiStatus.clientError
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
        tap(() => {
          if (!this.passwordComponent.isPasswordHidden) {
            this.passwordComponent.togglePasswordVisibility();
            this.passwordComponent.checkControlUpdate();
          }

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
