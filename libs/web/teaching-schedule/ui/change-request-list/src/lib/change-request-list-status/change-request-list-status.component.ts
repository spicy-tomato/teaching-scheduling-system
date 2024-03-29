import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider, TuiDialogService } from '@taiga-ui/core';
import { PermissionHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { ChangeSchedule } from '@teaching-scheduling-system/web/shared/data-access/models';
import { ScheduleConstant } from '@teaching-scheduling-system/web/shared/utils/constants';
import { RequestStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { ChangeDenyDialogComponent } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-deny-dialog';
import { ChangeSetRoomDialogComponent } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-set-room-dialog';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import {
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

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
export class ChangeRequestListStatusComponent implements OnInit {
  // INPUT
  @Input() displayText!: boolean;
  @Input() item!: ChangeSchedule;

  // PUBLIC PROPERTIES
  readonly requesting$: Observable<number[]>;
  readonly permissions$: Observable<number[]>;
  readonly accept$ = new Subject<void>();
  readonly statusList = ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS;

  // PRIVATE PROPERTIES
  private acceptDialog$!: Observable<void>;
  private denyDialog$!: Observable<void>;

  // CONSTRUCTOR
  constructor(
    private readonly store: RequestStore,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService
  ) {
    this.requesting$ = store.status$('queue');
    this.permissions$ = store.permissions$;

    this.handleAccept();
  }

  // LIFECYCLE
  ngOnInit(): void {
    // This function use ```item```, which is an @Input, so must be called in ngOnInit
    this.initDialog();
  }

  // PUBLIC METHODS
  onDeny(): void {
    this.denyDialog$.subscribe();
  }

  // PRIVATE METHODS
  private initDialog(): void {
    this.acceptDialog$ = this.dialogService.open(
      new PolymorpheusComponent(ChangeSetRoomDialogComponent, this.injector),
      {
        label: 'Xếp phòng cho giảng viên',
        data: this.item,
      }
    );
    this.denyDialog$ = this.dialogService.open(
      new PolymorpheusComponent(ChangeDenyDialogComponent, this.injector),
      {
        label: 'Từ chối yêu cầu thay đổi lịch giảng',
        data: this.item,
      }
    );
  }

  private handleAccept(): void {
    this.accept$
      .pipe(
        withLatestFrom(this.permissions$),
        switchMap(({ 1: permissions }) => {
          if (PermissionHelper.isDepartmentHead(permissions)) {
            this.store.accept(this.item);
            return of({});
          }

          return this.acceptDialog$;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
