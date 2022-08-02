import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TuiDestroyService, TuiValidationError } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiDialogService,
  TuiNotification,
} from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { requiredFactory } from '@teaching-scheduling-system/core/utils/factories';
import { StringHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { SuccessDialogComponent } from '@teaching-scheduling-system/web/reset-password/ui/success-dialog';
import { ResetPassword } from '@teaching-scheduling-system/web/shared/data-access/models';
import { SuccessDialogHeaderComponent } from '@teaching-scheduling-system/web/shared/ui/components/success-dialog-header';
import { differentControlValueValidator } from '@teaching-scheduling-system/web/shared/utils/validators';
import { navbarOptionsProvider } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ConfirmStore } from './store';

@Component({
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    navbarOptionsProvider({ showInfo: false }),
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        minlength: (): string => 'Mật khẩu cần có tối thiểu 6 ký tự',
        required: requiredFactory,
      },
    },
  ],
})
export class ConfirmComponent {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.store.status$;
  public readonly reset$ = new Subject<void>();
  public form!: FormGroup;

  /** PRIVATE PROPERTIES */
  private successDialog$!: Observable<void>;

  /** GETTERS */
  public get newPassword(): FormControl {
    return this.form.controls['newPassword'] as FormControl;
  }

  public get confirmPassword(): FormControl {
    return this.form.controls['confirmPassword'] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    @Inject(Injector) private readonly injector: Injector,
    private readonly tuiDialogService: TuiDialogService,
    private readonly alertService: TuiAlertService,
    private readonly store: ConfirmStore,
    private readonly destroy$: TuiDestroyService
  ) {
    this.initDialog();
    this.verifyToken();
    this.handleReset();
    this.initForm();
    this.handleStatusChange();
  }

  /** PUBLIC METHODS */
  public onNewPasswordChange(): void {
    this.confirmPassword.updateValueAndValidity();
  }

  public onConfirmPasswordChange(): void {
    if (this.confirmPassword.untouched) {
      this.confirmPassword.markAllAsTouched();
    }
  }

  private handleReset(): void {
    this.reset$
      .pipe(
        withLatestFrom(this.route.queryParamMap),
        tap(({ 1: params }) => {
          const data: ResetPassword = {
            email: params.get('email') || '',
            token: params.get('token') || '',
            newPassword: StringHelper.md5(this.newPassword.value),
          };
          this.store.reset({ data });
        })
      )
      .subscribe();
  }

  /** PRIVATE METHODS */
  private initDialog(): void {
    this.successDialog$ = this.tuiDialogService.open(
      new PolymorpheusComponent(SuccessDialogComponent, this.injector),
      {
        header: new PolymorpheusComponent(
          SuccessDialogHeaderComponent,
          this.injector
        ),
      }
    );
  }

  private verifyToken(): void {
    this.route.queryParamMap
      .pipe(
        tap((params) => {
          this.store.verifyToken({
            email: params.get('email'),
            token: params.get('token'),
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initForm(): void {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      token: ['', Validators.required],
    });

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
            this.successDialog$
              .pipe(tap(() => this.form.disable()))
              .subscribe();
          } else if (status === 'systemError') {
            this.alertService
              .open('Mã đặt lại mật khẩu đã hết hạn', {
                label: 'Đã có lỗi xảy ra',
                status: TuiNotification.Error,
              })
              .subscribe();
          }
        })
      )
      .subscribe();
  }
}
