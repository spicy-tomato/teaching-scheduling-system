import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { RequestStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'tss-change-request-pagination',
  templateUrl: './change-request-pagination.component.html',
  styleUrls: ['./change-request-pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeRequestPaginationComponent {
  // PUBLIC PROPERTIES
  selectedStatus: Nullable<number> = null;
  pageCount$: Observable<number>;
  page$: Observable<number>;

  // CONSTRUCTOR
  constructor(private readonly store: RequestStore) {
    this.page$ = store.page$;
    this.pageCount$ = store.pageCount$;
  }

  // PUBLIC METHODS
  onPageChange(page: number): void {
    this.store.changePage(page);
  }
}
