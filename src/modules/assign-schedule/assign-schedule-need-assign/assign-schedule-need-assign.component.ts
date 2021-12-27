import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModuleClass } from '@models/class/module-class.model';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAssignSchedule from '../state';

@Component({
  selector: 'tss-assign-schedule-need-assign',
  templateUrl: './assign-schedule-need-assign.component.html',
  styleUrls: ['./assign-schedule-need-assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignScheduleNeedAssignComponent {
  /** PUBLIC PROPERTIES */
  public data$!: Observable<ModuleClass[]>;
  public checkboxChangeAction: (checkbox: boolean[]) => Action = (checkbox) =>
    fromAssignSchedule.selectedNeedAssignChange({ checkbox });

  /** CONSTRUCTOR */
  constructor(store: Store<fromAssignSchedule.AssignScheduleState>) {
    this.data$ = store.select(fromAssignSchedule.selectNeedAssign);
  }
}
