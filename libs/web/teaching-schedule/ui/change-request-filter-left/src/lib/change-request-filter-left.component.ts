import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObjectHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  ChangeScheduleOptions,
  ChangeScheduleOptionsParam,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ScheduleConstant } from '@teaching-scheduling-system/web/shared/utils/constants';
import { RequestStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'tss-change-request-filter-left',
  templateUrl: './change-request-filter-left.component.html',
  styleUrls: ['./change-request-filter-left.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeRequestFilterLeftComponent {
  // INPUT
  @Input() forMenu = false;

  // PUBLIC PROPERTIES
  readonly statusList = ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  readonly statusArray = ObjectHelper.toArray(this.statusList, {
    uniqueValue: true,
  }).sort((a, b) => (a.id as number) - (b.id as number));
  readonly options$: Observable<ChangeScheduleOptions>;
  readonly isPersonal: boolean;

  // CONSTRUCTOR
  constructor(private readonly store: RequestStore, route: ActivatedRoute) {
    this.options$ = store.options$;
    this.isPersonal = route.snapshot.data['personal'] as boolean;
  }

  // PUBLIC METHODS
  changeOptions(options: ChangeScheduleOptionsParam): void {
    this.store.changeOptions(options);
  }
}
