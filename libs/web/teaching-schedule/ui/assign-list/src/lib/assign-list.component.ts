import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModuleClass } from '@teaching-scheduling-system/web/shared/data-access/models';
import { AssignStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'tss-assign-list',
  templateUrl: './assign-list.component.html',
  styleUrls: ['./assign-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignListComponent {
  // PUBLIC PROPERTIES
  data$: Observable<ModuleClass[]>;

  // CONSTRUCTOR
  constructor(store: AssignStore) {
    this.data$ = store.needAssign$;
  }
}
