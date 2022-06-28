import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ModuleClass,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  teachingScheduleAssignSelectAssigned,
  teachingScheduleAssignSelectedAssignedChange,
  teachingScheduleAssignSelectSelectedTeacher,
  TeachingScheduleAssignState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { combineLatest, map, Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-assign-result',
  templateUrl: './assign-result.component.html',
  styleUrls: ['./assign-result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AssignResultComponent {
  /** PUBLIC PROPERTIES */
  public readonly checkboxChangeAction: (checkbox: boolean[]) => Action = (
    checkbox
  ) => teachingScheduleAssignSelectedAssignedChange({ checkbox });
  public data$!: Observable<ModuleClass[]>;

  /** PRIVATE METHODS */
  private assigned$: Observable<ModuleClass[]>;
  private selectedTeacher$: Observable<Nullable<SimpleModel>>;

  /** CONSTRUCTOR */
  constructor(
    store: Store<TeachingScheduleAssignState>,
    destroy$: TuiDestroyService
  ) {
    this.assigned$ = store
      .select(teachingScheduleAssignSelectAssigned)
      .pipe(takeUntil(destroy$));
    this.selectedTeacher$ = store
      .select(teachingScheduleAssignSelectSelectedTeacher)
      .pipe(takeUntil(destroy$));

    this.triggerChangeData();
  }

  /** PRIVATE METHODS */
  private triggerChangeData(): void {
    this.data$ = combineLatest([this.assigned$, this.selectedTeacher$]).pipe(
      map(([assigned, teacher]) =>
        teacher ? assigned.filter((x) => x.teacher === teacher?.name) : assigned
      )
    );
  }
}
