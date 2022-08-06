import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  teachingScheduleRequestChangePage,
  teachingScheduleRequestSelectPage,
  teachingScheduleRequestSelectPageCount,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-change-request-pagination',
  templateUrl: './change-request-pagination.component.html',
  styleUrls: ['./change-request-pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ChangeRequestPaginationComponent {
  selectedStatus: Nullable<number> = null;
  pageCount$: Observable<number>;
  page$: Observable<number>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<TeachingScheduleRequestState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.page$ = store
      .select(teachingScheduleRequestSelectPage)
      .pipe(takeUntil(this.destroy$));
    this.pageCount$ = store
      .select(teachingScheduleRequestSelectPageCount)
      .pipe(takeUntil(this.destroy$));
  }

  /** PUBLIC METHODS */
  onPageChange(page: number): void {
    this.store.dispatch(teachingScheduleRequestChangePage({ page }));
  }
}
