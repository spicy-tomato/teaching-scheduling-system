import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModuleClass } from '@models/class/module-class.model';
import { SimpleModel } from '@models/core/simple.model';
import { BaseComponent } from '@modules/core/base/base.component';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as fromAssignSchedule from '../state';

@Component({
  selector: 'tss-assign-schedule-assigned',
  templateUrl: './assign-schedule-assigned.component.html',
  styleUrls: ['./assign-schedule-assigned.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignScheduleAssignedComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public data$!: Observable<ModuleClass[]>;
  public readonly checkboxChangeAction: (checkbox: boolean[]) => Action = (
    checkbox
  ) => fromAssignSchedule.selectedAssignedChange({ checkbox });

  /** PRIVATE METHODS */
  private assigned$: Observable<ModuleClass[]>;
  private selectedTeacher$: Observable<SimpleModel | null>;

  /** CONSTRUCTOR */
  constructor(store: Store<fromAssignSchedule.AssignScheduleState>) {
    super();

    this.assigned$ = store
      .select(fromAssignSchedule.selectAssigned)
      .pipe(takeUntil(this.destroy$));
    this.selectedTeacher$ = store
      .select(fromAssignSchedule.selectSelectedTeacher)
      .pipe(takeUntil(this.destroy$));

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
