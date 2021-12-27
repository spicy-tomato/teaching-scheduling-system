import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModuleClass } from '@models/class/module-class.model';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAssignSchedule from '../state';

@Component({
  selector: 'tss-assign-schedule-assigned',
  templateUrl: './assign-schedule-assigned.component.html',
  styleUrls: ['./assign-schedule-assigned.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignScheduleAssignedComponent {
  /** PUBLIC PROPERTIES */
  public data$!: Observable<ModuleClass[]>;
  public checkboxChangeAction: (checkbox: boolean[]) => Action = (checkbox) =>
    fromAssignSchedule.selectedAssignedChange({ checkbox });

  /** CONSTRUCTOR */
  constructor(store: Store<fromAssignSchedule.AssignScheduleState>) {
    this.data$ = store.select(fromAssignSchedule.selectAssigned);
  }
}
