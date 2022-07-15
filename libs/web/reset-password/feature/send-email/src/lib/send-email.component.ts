import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { requiredFactory } from '@teaching-scheduling-system/core/utils/factories';
import {
  AppShellState,
  setLoader,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { SuccessDialogHeaderComponent } from '@teaching-scheduling-system/web/shared/ui/components/success-dialog-header';
import { navbarOptionsProvider } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { tap } from 'rxjs';
import { SendEmailStore } from './store/send-email.store';

@Component({
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SendEmailStore,
    navbarOptionsProvider({ showInfo: false }),
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        email: (): string => 'Email không hợp lệ!',
        required: requiredFactory,
      },
    },
  ],
})
export class SendEmailComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.store.status$;
  public readonly tokenValidationFailed;
  public form!: FormGroup;

  /** GETTERS */
  public get email(): FormControl {
    return this.form.controls['email'] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    @Inject(Injector) private readonly injector: Injector,
    private readonly tuiDialogService: TuiDialogService,
    private readonly store: SendEmailStore,
    private readonly appShellStore: Store<AppShellState>
  ) {
    this.tokenValidationFailed =
      this.router.getCurrentNavigation()?.extras.state?.['validationFailed'] ||
      false;
    this.initForm();
    this.handleStatusChange();
  }

  /** LIFECYCLE */
  public ngOnInit(): void {
    this.appShellStore.dispatch(setLoader({ showLoader: false }));
  }

  /** PUBLIC METHODS */
  public request(): void {
    this.store.requestResetPassword({ email: this.email.value });
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private handleStatusChange(): void {
    this.status$
      .pipe(
        tap((status) => {
          if (status === 'successful') {
            this.tuiDialogService
              .open(
                `Email xác nhận đặt lại mật khẩu đã được gửi đến địa chỉ ${this.email.value}. Vui lòng nhấn vào đường dẫn được đính kèm để đặt lại mật khẩu!`,
                {
                  header: new PolymorpheusComponent(
                    SuccessDialogHeaderComponent,
                    this.injector
                  ),
                }
              )
              .subscribe();
            this.form.disable();
          } else if (status === 'clientError') {
            if (this.email.untouched) {
              this.email.markAsTouched();
            }
            this.email.setErrors(
              new TuiValidationError(
                'Email không tồn tại trên hệ thống, vui lòng kiểm tra lại!'
              )
            );
          }
        })
      )
      .subscribe();
  }
}
