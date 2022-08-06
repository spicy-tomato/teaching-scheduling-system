import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { requiredFactory } from '@teaching-scheduling-system/core/utils/factories';
import { StringHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { SettingsChangePasswordStore } from '@teaching-scheduling-system/web/settings/data-access';
import { ChangePassword } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  differentControlValueValidator,
  sameControlValueValidator,
} from '@teaching-scheduling-system/web/shared/utils/validators';
import { tap } from 'rxjs';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
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
export class ChangePasswordComponent {
  /** PUBLIC METHODS */
  status$ = this.store.status$;
  nameTitle$ = this.store.nameTitle$;
  form!: FormGroup;

  /** GETTERS */
  private get password(): FormControl {
    return this.form.controls['password'] as FormControl;
  }

  get newPassword(): FormControl {
    return this.form.controls['newPassword'] as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.controls['confirmPassword'] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: SettingsChangePasswordStore,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {
    this.initForm();
    this.handleStatusChange();
  }

  /** PUBLIC METHODS */
  onSubmit(): void {
    if (this.form.valid) {
      const password = this.password.value as string;
      const newPassword = this.newPassword.value as string;

      const form: ChangePassword = {
        password: StringHelper.md5(password),
        new_password: StringHelper.md5(newPassword),
      };
      this.store.change({ form });
    }
  }

  onPasswordChange(): void {
    this.newPassword.updateValueAndValidity();
  }

  onNewPasswordChange(): void {
    this.confirmPassword.updateValueAndValidity();
  }

  onConfirmPasswordChange(): void {
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
      token: ['', Validators.required],
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
        tap((status) => {
          if (status === 'successful') {
            this.form.reset();
            this.form.markAsPristine();
            this.alertService
              .open('Thay đổi mật khẩu thành công!', {
                status: TuiNotification.Success,
              })
              .subscribe();
          } else if (status === 'clientError') {
            this.password.setErrors(
              new TuiValidationError(
                'Mật khẩu không chính xác, vui lòng thử lại!'
              )
            );
          }
        })
      )
      .subscribe();
  }
}
