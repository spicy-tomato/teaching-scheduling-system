import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  TeachingScheduleAssignState,
  teachingScheduleAssign_Reset,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';

@Component({
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignComponent {
  // CONSTRUCTOR 
  constructor(store: Store<TeachingScheduleAssignState>) {
    store.dispatch(teachingScheduleAssign_Reset());
  }
}
