import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import * as fromChangePassword from './state';

@Component({
  selector: 'tss-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent extends BaseComponent {
  /** PUBLIC METHODS */
  public form!: FormGroup;
  public status$: Observable<EApiStatus>;
  public readonly EApiStatus = EApiStatus;

  /** GETTERS */
  public get password(): AbstractControl | null {
    return this.form.get('password');
  }

  public get newPassword(): AbstractControl | null {
    return this.form.get('newPassword');
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromChangePassword.ChangePasswordState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    this.status$ = store.select(fromChangePassword.selectStatus);
    this.initForm();
    this.handleChange();
  }

  /** PUBLIC METHODS */
  public onSubmit(): void {
    if (this.form.valid) {
      const form = {
        password: this.password?.value as string,
        new_password: this.newPassword?.value as string,
      };
      this.store.dispatch(fromChangePassword.change({ form }));
    }
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group(
      {
        password: ['', Validators.required],
        newPassword: [
          '',
          [Validators.required, Validators.minLength(6), duplicatedValue],
        ],
      },
      { validators: duplicatedValue }
    );
  }

  private handleChange(): void {
    this.store
      .select(fromChangePassword.selectStatus)
      .pipe(
        tap((status) => {
          if (status === EApiStatus.successful) {
            this.form.reset();
            this.notificationsService
              .show('Thay đổi mật khẩu thành công!', {
                status: TuiNotification.Success,
              })
              .subscribe();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}

export const duplicatedValue: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const newPassword = control.get('newPassword');

  return password &&
    newPassword &&
    password.value &&
    newPassword.value &&
    password.value === newPassword.value
    ? { duplicatedValue: true }
    : null;
};
