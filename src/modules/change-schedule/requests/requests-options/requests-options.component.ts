import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant } from '@shared/constants';
import { ObjectHelper } from '@shared/helpers';
import { ChangeScheduleOptions } from '@shared/models';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromRequests from '../state';

@Component({
  selector: 'tss-requests-options',
  templateUrl: './requests-options.component.html',
  styleUrls: ['./requests-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsOptionsComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public options$: Observable<ChangeScheduleOptions>;
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly statusArray = ObjectHelper.toArray(this.statusList);

  /** CONSTRUCTOR */
  constructor(private readonly store: Store<fromRequests.RequestsState>) {
    super();

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
  }

  /** PUBLIC METHODS */
  public onSelectedStatusChange(selectedStatus: number): void {
    this.store.dispatch(
      fromRequests.changeOptions({ options: { selectedStatus } })
    );
  }

  public onShowTimeInsteadOfShiftChange(showTimeInsteadOfShift: boolean): void {
    this.store.dispatch(
      fromRequests.changeOptions({ options: { showTimeInsteadOfShift } })
    );
  }

  public onShowTimeChange(showTime: boolean): void {
    this.store.dispatch(
      fromRequests.changeOptions({ options: { showTime } })
    );
  }
}
