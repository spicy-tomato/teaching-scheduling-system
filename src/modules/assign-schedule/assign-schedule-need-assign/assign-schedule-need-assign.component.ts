import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModuleClass } from 'src/shared/models';
import * as fromAssignSchedule from '../state';

@Component({
  selector: 'tss-assign-schedule-need-assign',
  templateUrl: './assign-schedule-need-assign.component.html',
  styleUrls: ['./assign-schedule-need-assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignScheduleNeedAssignComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public data$: Observable<ModuleClass[]>;
  public readonly checkboxChangeAction: (checkbox: boolean[]) => Action = (
    checkbox
  ) => fromAssignSchedule.selectedNeedAssignChange({ checkbox });

  /** CONSTRUCTOR */
  constructor(store: Store<fromAssignSchedule.AssignScheduleState>) {
    super();

    this.data$ = store
      .select(fromAssignSchedule.selectNeedAssign)
      .pipe(takeUntil(this.destroy$));
  }
}
