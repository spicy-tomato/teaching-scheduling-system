import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { IconConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { SettingsShellStore } from '@teaching-scheduling-system/web/settings/data-access';
import { filter, map, Subject, switchMap, tap, withLatestFrom } from 'rxjs';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SettingsShellStore, TuiDestroyService],
})
export class ShellComponent implements OnInit {
  // PUBLIC PROPERTIES
  readonly authStatus$ = this.store.authStatus$;
  readonly revokeStatus$ = this.store.revokeStatus$;
  readonly error$ = this.store.error$;
  readonly nameTitle$ = this.store.nameTitle$;
  readonly settings$ = this.store.teacher$.pipe(map((t) => t.settings));
  readonly connectGoogle$ = new Subject<void>();

  // PUBLIC PROPERTIES
  readonly IconConstant = IconConstant;

  // CONSTRUCTOR
  constructor(
    private readonly route: ActivatedRoute,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private readonly store: SettingsShellStore
  ) {
    this.handleStatusChange();
  }

  // LIFECYCLE
  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        tap((params) => {
          const code = params['code'];
          if (code) {
            this.store.authorize(code);
          }
        })
      )
      .subscribe();
  }

  // PUBLIC METHODS
  connectGoogle(): void {
    this.store.authenticate();
  }

  revokeGoogle(): void {
    this.store.revoke();
  }

  // PRIVATE METHODS
  private handleStatusChange(): void {
    this.authStatus$
      .pipe(
        filter((status) => status === 'successful'),
        withLatestFrom(this.nameTitle$),
        switchMap(({ 1: nameTitle }) => {
          return this.alertService.open(
            `Giờ đây ${nameTitle} có thể xem các sự kiện của Google Lịch trên trang web này`,
            {
              label: 'Liên kết tài khoản thành công',
              status: TuiNotification.Success,
              autoClose: 10000,
            }
          );
        })
      )
      .subscribe();
    this.revokeStatus$
      .pipe(
        filter((status) => status === 'successful'),
        switchMap(() => {
          return this.alertService.open(`Hủy kết nối Google Lịch thành công!`, {
            status: TuiNotification.Success,
            autoClose: 5000,
          });
        })
      )
      .subscribe();
    this.error$
      .pipe(
        ObservableHelper.filterNullish(),
        switchMap((error) => {
          return this.alertService.open(error, {
            label: 'Đã có lỗi xảy ra',
            status: TuiNotification.Error,
          });
        })
      )
      .subscribe();
  }
}
