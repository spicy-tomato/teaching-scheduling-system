import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAssignSchedule from './state';

@Component({
  selector: 'tss-assign-schedule-result',
  templateUrl: './assign-schedule-result.component.html',
  styleUrls: ['./assign-schedule-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignScheduleResultComponent {
  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>
  ) {
    this.store.dispatch(fromAssignSchedule.reset());
  }
}
