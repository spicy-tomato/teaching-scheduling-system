import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ModuleClass,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { AssignStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'tss-assign-result',
  templateUrl: './assign-result.component.html',
  styleUrls: ['./assign-result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignResultComponent {
  // PUBLIC PROPERTIES
  data$!: Observable<ModuleClass[]>;

  // PRIVATE METHODS
  private assigned$: Observable<ModuleClass[]>;
  private selectedTeacher$: Observable<Nullable<SimpleModel>>;

  // CONSTRUCTOR
  constructor(store: AssignStore) {
    this.assigned$ = store.assigned$;
    this.selectedTeacher$ = store.teacher$('selected');

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
