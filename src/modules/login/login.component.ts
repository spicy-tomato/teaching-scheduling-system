import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { BaseComponent } from '@modules/base/base.component';

import {  Observable, Subject } from 'rxjs';
import { debounceTime, filter, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromLogin from './state';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { LoginForm } from '@models/login/login-form.model';
import { EApiStatus } from 'src/enums/api-status.enum';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        query(':self, .slide-element', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(
            '150ms',
            [animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))]
          )
        ], { optional: true })
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends BaseComponent {
  public status$: Observable<EApiStatus>;
  public readonly submit$ = new Subject<void>();

  public readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false)
  });

  public get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  public get LoginStatus(): typeof EApiStatus {
    return EApiStatus;
  }

  constructor(
    private store: Store<fromLogin.LoginState>,
    @Inject(TuiNotificationsService) private notificationsService: TuiNotificationsService) {
    super();

    this.status$ = store.select(fromLogin.selectState)
      .pipe(
        takeUntil(this.destroy$)
      );

    this.handleLoginFailed();
    this.handleSubmit();
  }

  private handleLoginFailed(): void {
    this.status$
      .pipe(
        filter(status => status === this.LoginStatus.failed),
        mergeMap(() =>
          this.notificationsService
            .show(
              'Hãy thử lại', {
              label: 'Thông tin đăng nhập không chính xác!',
              status: TuiNotification.Error
            })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSubmit(): void {
    this.submit$
      .pipe(
        debounceTime(300),
        tap(() => {
          const loginForm = this.loginForm.value as LoginForm;
          this.store.dispatch(fromLogin.clickLogin({ loginForm }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
