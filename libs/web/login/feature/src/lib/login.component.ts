import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
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
  AppShellState,
  setLoader,
} from '@teaching-scheduling-system/web/shared/data-access/store';
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
  // VIEWCHILD 
  @ViewChild(TuiInputPasswordComponent, { static: true })
  passwordComponent!: TuiInputPasswordComponent;

  // PUBLIC PROPERTIES 
  status$: Observable<EApiStatus>;
  readonly submit$ = new Subject<void>();
  readonly loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });

  // GETTERS 
  get username(): FormControl {
    return this.loginForm.controls['username'] as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.controls['password'] as FormControl;
  }

  // CONSTRUCTOR 
  constructor(
    private readonly store: Store<LoginState>,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    appShellStore.dispatch(setLoader({ showLoader: false }));
    store.dispatch(reset());

    this.status$ = store.select(selectState).pipe(takeUntil(this.destroy$));

    this.handleStatusChange();
    this.handleLoginFailed();
    this.handleSubmit();
  }

  // PRIVATE METHODS 
  private handleStatusChange(): void {
    this.status$
      .pipe(
        map((status) => status === 'loading' || status === 'successful'),
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
          (status) => status === 'clientError' || status === 'systemError'
        ),
        mergeMap((status) => {
          const label =
            status === 'clientError'
              ? 'Thông tin đăng nhập không chính xác!'
              : 'Lỗi hệ thống!';
          return this.alertService.open('Vui lòng thử lại', {
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
