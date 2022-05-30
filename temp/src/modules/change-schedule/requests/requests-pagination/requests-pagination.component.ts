import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { Nullable } from '@shared/models';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromRequests from '../state';

@Component({
  selector: 'tss-requests-pagination',
  templateUrl: './requests-pagination.component.html',
  styleUrls: ['./requests-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsPaginationComponent extends BaseComponent {
  public selectedStatus: Nullable<number> = null;
  public pageCount$: Observable<number>;
  public page$: Observable<number>;

  /** CONSTRUCTOR */
  constructor(private readonly store: Store<fromRequests.RequestsState>) {
    super();

    this.page$ = store
      .select(fromRequests.selectPage)
      .pipe(takeUntil(this.destroy$));
    this.pageCount$ = store
      .select(fromRequests.selectPageCount)
      .pipe(takeUntil(this.destroy$));
  }

  /** PUBLIC METHODS */
  public onPageChange(page: number): void {
    this.store.dispatch(fromRequests.changePage({ page }));
  }
}
