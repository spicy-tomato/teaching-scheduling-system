import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ModuleClass,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  TeachingScheduleAssignState,
  teachingScheduleAssign_SelectAssigned,
  teachingScheduleAssign_SelectSelectedTeacher,
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
  // PUBLIC PROPERTIES 
  data$!: Observable<ModuleClass[]>;

  // PRIVATE METHODS 
  private assigned$: Observable<ModuleClass[]>;
  private selectedTeacher$: Observable<Nullable<SimpleModel>>;

  // CONSTRUCTOR 
  constructor(
    store: Store<TeachingScheduleAssignState>,
    destroy$: TuiDestroyService
  ) {
    this.assigned$ = store
      .select(teachingScheduleAssign_SelectAssigned)
      .pipe(takeUntil(destroy$));
    this.selectedTeacher$ = store
      .select(teachingScheduleAssign_SelectSelectedTeacher)
      .pipe(takeUntil(destroy$));

    this.triggerChangeData();
  }

  // PRIVATE METHODS 
  private triggerChangeData(): void {
    this.data$ = combineLatest([this.assigned$, this.selectedTeacher$]).pipe(
      map(([assigned, teacher]) =>
        teacher ? assigned.filter((x) => x.teacher === teacher?.name) : assigned
      )
    );
  }
}
