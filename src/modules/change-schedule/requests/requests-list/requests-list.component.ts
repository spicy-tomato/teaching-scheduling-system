import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant, TableConstant } from '@shared/constants';
import { EApiStatus } from '@shared/enums';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleStatus,
} from '@shared/models';
import { TUI_BUTTON_OPTIONS, TuiAppearance } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromRequests from '../state';

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
  constructor(private readonly store: Store<fromRequests.RequestsState>) {
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
    this.store.dispatch(fromRequests.deny({ id }));
  }
}
