import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider, TuiDialogService } from '@taiga-ui/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { PermissionHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { ChangeSchedule } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectPermission,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { ScheduleConstant } from '@teaching-scheduling-system/web/shared/utils/constants';
import {
  teachingScheduleRequestAccept,
  teachingScheduleRequestSelectRequestQueue,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { ChangeDenyDialogComponent } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-deny-dialog';
import { ChangeSetRoomDialogComponent } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-set-room-dialog';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'tss-change-request-list-status',
  templateUrl: './change-request-list-status.component.html',
  styleUrls: ['./change-request-list-status.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiButtonOptionsProvider({
      shape: 'square',
      appearance: 'primary',
      size: 'xs',
    }),
  ],
})
export class ChangeRequestListStatusComponent {
  /** INPUT */
  @Input() public displayText!: boolean;
  @Input() public item!: ChangeSchedule;

  /** PUBLIC PROPERTIES */
  public readonly requesting$: Observable<number[]>;
  public readonly permissions$: Observable<number[]>;
  public readonly accept$ = new Subject<void>();
  public readonly statusList = ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<TeachingScheduleRequestState>,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.requesting$ = store
      .select(teachingScheduleRequestSelectRequestQueue)
      .pipe(takeUntil(this.destroy$));
    this.permissions$ = appShellStore
      .select(selectPermission)
      .pipe(takeUntil(this.destroy$));

    this.handleAccept();
  }

  /** PUBLIC METHODS */
  public onDeny(): void {
    this.dialogService
      .open(
        new PolymorpheusComponent(ChangeDenyDialogComponent, this.injector),
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
            this.store.dispatch(
              teachingScheduleRequestAccept({ schedule: this.item })
            );
            return;
          }

          this.dialogService
            .open<Nullable<string>>(
              new PolymorpheusComponent(
                ChangeSetRoomDialogComponent,
                this.injector
              ),
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
