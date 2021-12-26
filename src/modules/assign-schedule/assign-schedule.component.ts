import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeInOut } from '@animations/fade.animation';
import { ModuleClass } from '@models/class/module-class.model';
import { SimpleModel } from '@models/core/simple.model';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromAssignSchedule from './state';

@Component({
  selector: 'tss-assign-schedule',
  templateUrl: './assign-schedule.component.html',
  styleUrls: ['./assign-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
export class AssignScheduleComponent extends BaseComponent {
  public selectedTeacher: SimpleModel | null = null;
  public teachers$: Observable<SimpleModel[]>;
  public needAssign$: Observable<ModuleClass[]>;

  /** CONSTRUCTOR */
  constructor(store: Store<fromAssignSchedule.AssignScheduleState>) {
    super();

    this.teachers$ = store
      .select(fromAssignSchedule.selectTeachers)
      .pipe(takeUntil(this.destroy$));

    this.needAssign$ = store.select(fromAssignSchedule.selectNeedAssign);
  }
}
