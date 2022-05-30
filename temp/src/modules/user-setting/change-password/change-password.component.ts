import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { EApiStatus } from '@shared/enums';
import { Md5 } from 'ts-md5';
import * as fromChangePassword from './state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ChangePassword } from 'src/shared/models';
import {
  differentControlValueValidator,
  sameControlValueValidator,
} from '@shared/validators';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { requiredFactory } from '@shared/factories';

@Component({
  selector: 'tss-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        minlength: (): string => 'Mật khẩu cần có tối thiểu 6 ký tự',
        required: requiredFactory,
      },
    },
  ],
})
export class ChangePasswordComponent extends BaseComponent {
  /** PUBLIC METHODS */
  public form!: FormGroup;
  public status$: Observable<EApiStatus>;
  public nameTitle$!: Observable<string>;
  public readonly EApiStatus = EApiStatus;

  /** GETTERS */
  public get password(): AbstractControl {
    return this.form.controls['password'];
  }

  public get newPassword(): AbstractControl {
    return this.form.controls['newPassword'];
  }

  public get confirmPassword(): AbstractControl {
    return this.form.controls['confirmPassword'];
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromChangePassword.ChangePasswordState>,
    appShellStore: Store<fromAppShell.AppShellState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    this.status$ = store
      .select(fromChangePassword.selectStatus)
      .pipe(takeUntil(this.destroy$));
    this.nameTitle$ = appShellStore
      .select(fromAppShell.selectNameTitle)
      .pipe(takeUntil(this.destroy$));

    this.store.dispatch(fromChangePassword.reset());

    this.initForm();
    this.handleStatusChange();
  }

  /** PUBLIC METHODS */
  public onSubmit(): void {
    if (this.form.valid) {
      const password = this.password?.value as string;
      const newPassword = this.newPassword?.value as string;

      const form: ChangePassword = {
        password: new Md5().appendStr(password).end() as string,
        new_password: new Md5().appendStr(newPassword).end() as string,
      };
      this.store.dispatch(fromChangePassword.change({ form }));
    }
  }

  public onConfirmPasswordChange(): void {
    if (this.confirmPassword.untouched) {
      this.confirmPassword.markAllAsTouched();
    }
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.newPassword.addValidators(
      sameControlValueValidator(this.password, {
        error: new TuiValidationError(
          'Mật khẩu mới không được trùng mật khẩu cũ!'
        ),
      })
    );

    this.confirmPassword.addValidators(
      differentControlValueValidator(this.newPassword, {
        error: new TuiValidationError(
          'Xác nhận mật khẩu không khớp với mật khẩu mới!'
        ),
      })
    );
  }

  private handleStatusChange(): void {
    this.status$
      .pipe(
        filter((status) => status === EApiStatus.successful),
        tap(() => {
          this.form.reset();
          this.notificationsService
            .show('Thay đổi mật khẩu thành công!', {
              status: TuiNotification.Success,
            })
            .subscribe();
        })
      )
      .subscribe();

    this.status$
      .pipe(
        filter((status) => status === EApiStatus.clientError),
        tap(() => {
          this.password.setErrors(
            new TuiValidationError(
              'Mật khẩu không chính xác, vui lòng thử lại!'
            )
          );
        })
      )
      .subscribe();
  }
}
