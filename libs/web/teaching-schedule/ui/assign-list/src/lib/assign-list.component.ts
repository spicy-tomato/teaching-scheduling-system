import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ModuleClass } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  teachingScheduleAssignSelectedNeedAssignChange,
  teachingScheduleAssignSelectNeedAssign,
  TeachingScheduleAssignState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-assign-list',
  templateUrl: './assign-list.component.html',
  styleUrls: ['./assign-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AssignListComponent {
  /** PUBLIC PROPERTIES */
  public data$: Observable<ModuleClass[]>;
  public readonly checkboxChangeAction: (checkbox: boolean[]) => Action = (
    checkbox
  ) => teachingScheduleAssignSelectedNeedAssignChange({ checkbox });

  /** CONSTRUCTOR */
  constructor(
    store: Store<TeachingScheduleAssignState>,
    destroy$: TuiDestroyService
  ) {
    this.data$ = store
      .select(teachingScheduleAssignSelectNeedAssign)
      .pipe(takeUntil(destroy$));
  }
}
