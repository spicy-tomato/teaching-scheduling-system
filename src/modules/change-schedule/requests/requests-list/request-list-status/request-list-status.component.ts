import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant } from '@shared/constants';
import { ChangeSchedule, Nullable } from '@shared/models';
import {
  TuiAppearance,
  TuiDialogService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import * as fromRequests from '../../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { DenyDialogComponent } from '../../_shared/deny-dialog/deny-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { PermissionHelper } from '@shared/helpers';
import { SetRoomDialogComponent } from '../../_shared/set-room-dialog/set-room-dialog.component';

@Component({
  selector: 'tss-request-list-status',
  templateUrl: './request-list-status.component.html',
  styleUrls: ['./request-list-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: 'square',
        appearance: TuiAppearance.Primary,
        size: 'xs',
      },
    },
  ],
})
export class RequestListStatusComponent extends BaseComponent {
  /** INPUT */
  @Input() public displayText!: boolean;
  @Input() public item!: ChangeSchedule;

  /** PUBLIC PROPERTIES */
  public readonly requesting$: Observable<number[]>;
  public readonly permissions$: Observable<number[]>;
  public readonly accept$ = new Subject();
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromRequests.RequestsState>,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.accept$]);

    this.requesting$ = store
      .select(fromRequests.selectRequestQueue)
      .pipe(takeUntil(this.destroy$));
    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));

    this.handleAccept();
  }

  /** PUBLIC METHODS */
  public onDeny(): void {
    this.dialogService
      .open(
        new PolymorpheusComponent(DenyDialogComponent, this.injector),
        {
          label: 'Từ chối yêu cầu thay đổi lịch giảng',
          data: this.item,
        }
      )
      .subscribe();
  }

  /** PRIVATE METHODS */
  private handleAccept(): void {
    this.accept$
      .pipe(
        withLatestFrom(this.permissions$),
        tap(({ 1: permissions }) => {
          if (PermissionHelper.isDepartmentHead(permissions)) {
            this.store.dispatch(fromRequests.accept({ schedule: this.item }));
            return;
          }

          this.dialogService
            .open<Nullable<string>>(
              new PolymorpheusComponent(SetRoomDialogComponent, this.injector),
              {
                label: 'Xếp phòng cho giảng viên',
                data: this.item,
              }
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
