import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { PermissionConstant, TableConstant } from '@shared/constants';
import { EApiStatus } from '@shared/enums';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleStatus,
} from '@shared/models';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import * as fromRequests from '../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tss-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsListComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public columns: string[] = [];
  public initialColumns = [
    'index',
    'teacher',
    'moduleClass',
    'oldDate',
    'newDate',
    'oldShift',
    'newShift',
    'oldRoom',
    'newRoom',
    'reason',
    'timeRequest',
    'timeAccept',
    'timeSetRoom',
    'status',
    'actions',
  ];

  public readonly data$: Observable<ChangeSchedule[]>;
  public readonly status$: Observable<ChangeScheduleStatus>;
  public readonly page$: Observable<number>;
  public readonly options$: Observable<ChangeScheduleOptions>;
  public readonly permissions$: Observable<number[]>;

  public readonly personal: boolean;

  public readonly EApiStatus = EApiStatus;
  public readonly itemsPerPage = TableConstant.REQUESTS_LIST_ITEMS_PER_PAGE;
  public readonly PermissionConstant = PermissionConstant;

  /** CONSTRUCTOR */
  constructor(
    store: Store<fromRequests.RequestsState>,
    appShellStore: Store<fromAppShell.AppShellState>,
    route: ActivatedRoute
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
    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));

    this.personal = route.snapshot.data['personal'] as boolean;

    this.configureColumns();
    this.handleOptionsChange();
  }

  /** PRIVATE METHODS */
  private configureColumns(): void {
    if (this.personal) {
      this.initialColumns = this.initialColumns.filter((x) => x !== 'teacher');
    }
  }

  private handleOptionsChange(): void {
    this.options$
      .pipe(
        map((option) => option.showReason),
        distinctUntilChanged(),
        tap((showReason) => {
          if (showReason) {
            this.columns = this.initialColumns;
          } else {
            this.columns = this.initialColumns.filter((x) => x !== 'reason');
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
