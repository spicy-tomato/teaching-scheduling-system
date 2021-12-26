import { Component } from '@angular/core';
import { ModuleClass } from '@models/class/module-class.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAssignSchedule from '../state';

@Component({
  selector: 'tss-assign-schedule-assigned',
  templateUrl: './assign-schedule-assigned.component.html',
  styleUrls: ['./assign-schedule-assigned.component.scss'],
})
export class AssignScheduleAssignedComponent {
  /** PUBLIC PROPERTIES */
  public data$!: Observable<ModuleClass[]>;

  /** CONSTRUCTOR */
  constructor(store: Store<fromAssignSchedule.AssignScheduleState>) {
    this.data$ = store.select(fromAssignSchedule.selectAssigned);
  }
}
