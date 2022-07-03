import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { TuiInputPasswordComponent } from '@taiga-ui/kit';
import { slideUp } from '@teaching-scheduling-system/core/ui/animations';
import { StringHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  clickLogin,
  LoginState,
  reset,
  selectState,
} from '@teaching-scheduling-system/web/login/data-access';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { LoginForm } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [slideUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class LoginComponent {
  /** VIEWCHILD */
  @ViewChild(TuiInputPasswordComponent, { static: true })
  public passwordComponent!: TuiInputPasswordComponent;

  /** PUBLIC PROPERTIES */
  public status$: Observable<EApiStatus>;
  public readonly submit$ = new Subject<void>();
  public readonly loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });
  public readonly EApiStatus = EApiStatus;

  /** GETTERS */
  public get username(): FormControl {
    return this.loginForm.controls['username'] as FormControl;
  }

  public get password(): FormControl {
    return this.loginForm.controls['password'] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<LoginState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly destroy$: TuiDestroyService
  ) {
    store.dispatch(reset());

    this.status$ = store.select(selectState).pipe(takeUntil(this.destroy$));

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
          return this.notificationsService.show('Vui lòng thử lại', {
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

          const username = this.username.value as string;
          const password = this.password.value as string;

          const loginForm: LoginForm = {
            username,
            password: StringHelper.md5(password),
          };
          this.store.dispatch(clickLogin({ loginForm }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
