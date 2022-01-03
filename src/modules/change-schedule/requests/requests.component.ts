import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant, TableConstant } from '@shared/constants';
import { EApiStatus } from '@shared/enums';
import { ObjectHelper } from '@shared/helpers';
import { ChangeSchedule, ChangeScheduleStatus, Nullable } from '@shared/models';
import { TUI_BUTTON_OPTIONS, TuiAppearance } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as fromRequests from './state';

@Component({
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
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
export class RequestsComponent extends BaseComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public data$: Observable<ChangeSchedule[]>;
  public status$: Observable<ChangeScheduleStatus>;
  public requesting$: Observable<number[]>;
  public pageCount$: Observable<number>;
  public page$: Observable<number>;

  public selectedStatus: Nullable<number> = null;
  public showTimeInsteadOfShift = false;
  public showTime = false;

  public readonly EApiStatus = EApiStatus;
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly statusArray = ObjectHelper.toArray(this.statusList);
  public readonly shifts = CoreConstant.SHIFTS;
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
  constructor(private readonly store: Store<fromRequests.RequestsState>) {
    super();

    store.dispatch(fromRequests.reset());

    this.data$ = store.select(fromRequests.selectChangeSchedules).pipe(
      takeUntil(this.destroy$),
      tap((x) => console.log(x))
    );
    this.status$ = store
      .select(fromRequests.selectStatus)
      .pipe(takeUntil(this.destroy$));
    this.requesting$ = store
      .select(fromRequests.selectRequestQueue)
      .pipe(takeUntil(this.destroy$));
    this.page$ = store
      .select(fromRequests.selectPage)
      .pipe(takeUntil(this.destroy$));
    this.pageCount$ = store
      .select(fromRequests.selectPageCount)
      .pipe(takeUntil(this.destroy$));
  }

  /** LIFE CYCLES */
  public ngOnInit(): void {
    this.store.dispatch(
      fromRequests.load({
        query: {
          status: 'all',
          page: 1,
        },
      })
    );
  }

  /** PUBLIC METHODS */
  public onSelectedStatusChange(id: number): void {
    this.store.dispatch(
      fromRequests.load({
        query: {
          status: id ?? 'all',
          page: 1,
        },
      })
    );
  }

  public onAccept(id: number): void {
    this.store.dispatch(fromRequests.accept({ id }));
  }

  public onDeny(id: number): void {
    this.store.dispatch(fromRequests.deny({ id }));
  }

  public onPageChange(page: number): void {
    this.store.dispatch(
      fromRequests.load({
        query: {
          status: this.selectedStatus ?? 'all',
          page: page + 1,
        },
      })
    );
  }
}
