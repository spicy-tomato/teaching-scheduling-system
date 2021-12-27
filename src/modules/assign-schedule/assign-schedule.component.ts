import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeInOut } from '@animations/fade.animation';
import { Store } from '@ngrx/store';
import * as fromAssignSchedule from './state';

@Component({
  selector: 'tss-assign-schedule',
  templateUrl: './assign-schedule.component.html',
  styleUrls: ['./assign-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
export class AssignScheduleComponent {
  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>
  ) {
    this.store.dispatch(fromAssignSchedule.reset());
  }
}
