import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
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
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { Md5 } from 'ts-md5';
import * as fromChangePassword from './state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ChangePassword, Nullable } from 'src/shared/models';

@Component({
  selector: 'tss-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ChangePasswordComponent extends BaseComponent {
  /** PUBLIC METHODS */
  public form!: FormGroup;
  public status$: Observable<EApiStatus>;
  public nameTitle$!: Observable<string>;
  public wrongPasswordError$ = new BehaviorSubject<
    Nullable<TuiValidationError>
  >(null);
  public readonly EApiStatus = EApiStatus;

  /** GETTERS */
  public get password(): Nullable<AbstractControl> {
    return this.form.get('password');
  }

  public get newPassword(): Nullable<AbstractControl> {
    return this.form.get('newPassword');
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
    this.handleChange();
    this.handleWrongPassword();
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
  }

  private handleWrongPassword(): void {
    if (!this.password) return;

    const statusChanges$ = this.status$.pipe(
      map((status) =>
        status === EApiStatus.clientError
          ? new TuiValidationError(
              'Mật khẩu không chính xác, vui lòng thử lại!'
            )
          : null
      )
    );

    const passwordInputChanges$ = this.password.valueChanges.pipe(
      filter(() => this.wrongPasswordError$.value !== null),
      map(() => null)
    );

    merge(statusChanges$, passwordInputChanges$)
      .pipe(
        tap((status) => this.wrongPasswordError$.next(status)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}

const duplicatedValue: ValidatorFn = (
  control: AbstractControl
): Nullable<ValidationErrors> => {
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
