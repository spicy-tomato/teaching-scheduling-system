import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant, TableConstant } from '@shared/constants';
import { EApiStatus } from '@shared/enums';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleStatus,
  Nullable,
} from '@shared/models';
import {
  TUI_BUTTON_OPTIONS,
  TuiAppearance,
  TuiDialogService,
} from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import * as fromRequests from '../state';
import { DenyDialogComponent } from '../_shared/deny-dialog/deny-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'tss-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
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
export class RequestsListComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public data$: Observable<ChangeSchedule[]>;
  public status$: Observable<ChangeScheduleStatus>;
  public page$: Observable<number>;
  public requesting$: Observable<number[]>;
  public options$: Observable<ChangeScheduleOptions>;

  public readonly EApiStatus = EApiStatus;
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly itemsPerPage = TableConstant.REQUESTS_LIST_ITEMS_PER_PAGE;
  public readonly columns = [
    'index',
    'teacher',
    'moduleClass',
    'oldDate',
    'newDate',
    'oldShift',
    'newShift',
    'oldRoom',
    'newRoom',
    'timeRequest',
    'timeAccept',
    'timeSetRoom',
    'status',
  ];

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromRequests.RequestsState>,
    @Inject(Injector) private injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {
    super();

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
    this.data$ = store
      .select(fromRequests.selectChangeSchedules)
      .pipe(takeUntil(this.destroy$));
    this.status$ = store
      .select(fromRequests.selectStatus)
      .pipe(takeUntil(this.destroy$));
    this.page$ = store
      .select(fromRequests.selectPage)
      .pipe(takeUntil(this.destroy$));
    this.requesting$ = store
      .select(fromRequests.selectRequestQueue)
      .pipe(takeUntil(this.destroy$));
  }

  /** PUBLIC METHODS */
  public onAccept(id: number): void {
    this.store.dispatch(fromRequests.accept({ id }));
  }

  public onDeny(id: number): void {
    this.dialogService
      .open<Nullable<string>>(
        new PolymorpheusComponent(DenyDialogComponent, this.injector),
        {
          label: 'Từ chối yêu cầu thay đổi lịch giảng',
          dismissible: false,
        }
      )
      .pipe(
        filter((x) => !!x),
        tap((reason) =>
          this.store.dispatch(fromRequests.deny({ id, reason: reason ?? '' }))
        )
      )
      .subscribe();
  }
}
