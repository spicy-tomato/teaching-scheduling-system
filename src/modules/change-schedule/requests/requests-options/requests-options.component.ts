import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant } from '@shared/constants';
import { ObjectHelper } from '@shared/helpers';
import {
  ChangeScheduleOptions,
  ChangeScheduleOptionsParam,
} from '@shared/models';
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
  public personal: boolean;
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly statusArray = ObjectHelper.toArray(this.statusList);

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromRequests.RequestsState>,
    route: ActivatedRoute
  ) {
    super();

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));

    this.personal = route.snapshot.data['personal'] as boolean;
  }

  /** PUBLIC METHODS */
  public changeOptions(options: ChangeScheduleOptionsParam): void {
    this.store.dispatch(fromRequests.changeOptions({ options }));
  }
}
