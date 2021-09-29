import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { BaseComponent } from '@modules/app/base.component';

import { Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromLogin from './state';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

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
export class LoginComponent extends BaseComponent implements OnInit {
  status$: Observable<fromLogin.LoginStatus>;

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false)
  });

  get email(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get LoginStatus(): typeof fromLogin.LoginStatus {
    return fromLogin.LoginStatus;
  }

  constructor(
    private store: Store<fromLogin.LoginState>,
    @Inject(TuiNotificationsService) private notificationsService: TuiNotificationsService) {
    super();
    this.status$ = store.select(fromLogin.selectState);
  }

  ngOnInit(): void {
    this.status$
      .pipe(
        filter(status => status === this.LoginStatus.failed),
        tap(() => this.showNotification()),
        takeUntil(this.destroy$)
      ).subscribe();
  }

  onSubmit(): void {
    const loginForm = this.loginForm.value;
    this.store.dispatch(fromLogin.clickLogin({ loginForm }));
  }

  showNotification() {
    this.notificationsService
      .show(
        'Hãy thử lại', {
        label: 'Thông tin đăng nhập không chính xác!',
        status: TuiNotification.Error
      }
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
