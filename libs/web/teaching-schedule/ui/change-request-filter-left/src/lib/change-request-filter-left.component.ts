import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ObjectHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  ChangeScheduleOptions,
  ChangeScheduleOptionsParam,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ScheduleConstant } from '@teaching-scheduling-system/web/shared/utils/constants';
import {
  teachingScheduleRequestChangeOptions,
  teachingScheduleRequestSelectOptions,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-change-request-filter-left',
  templateUrl: './change-request-filter-left.component.html',
  styleUrls: ['./change-request-filter-left.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ChangeRequestFilterLeftComponent {
  /** INPUT */
  @Input() public forMenu = false;

  /** PUBLIC PROPERTIES */
  public readonly statusList = ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly statusArray = ObjectHelper.toArray(this.statusList, {
    uniqueValue: true,
  }).sort((a, b) => (a.id as number) - (b.id as number));
  public readonly options$: Observable<ChangeScheduleOptions>;
  public readonly isPersonal: boolean;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<TeachingScheduleRequestState>,
    private readonly destroy$: TuiDestroyService,
    route: ActivatedRoute
  ) {
    this.options$ = store
      .select(teachingScheduleRequestSelectOptions)
      .pipe(takeUntil(this.destroy$));

    this.isPersonal = route.snapshot.data['personal'] as boolean;
  }

  /** PUBLIC METHODS */
  public changeOptions(options: ChangeScheduleOptionsParam): void {
    this.store.dispatch(teachingScheduleRequestChangeOptions({ options }));
  }
}
