import { Component } from '@angular/core';
import { ModuleClass } from '@models/class/module-class.model';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import * as fromAssignSchedule from '../state';

@Component({
  selector: 'tss-assign-schedule-right-title',
  templateUrl: './assign-schedule-right-title.component.html',
  styleUrls: ['./assign-schedule-right-title.component.scss'],
})
export class AssignScheduleRightTitleComponent extends BaseComponent {
  public assigned$: Observable<ModuleClass[]>;
  public selectedAssigned$: Observable<boolean[]>;
  public someAssignedCheckedChange$!: Observable<boolean>;
  public discardAssign$ = new Subject<void>();

  constructor(
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>
  ) {
    super();

    this.assigned$ = this.store
      .select(fromAssignSchedule.selectAssigned)
      .pipe(takeUntil(this.destroy$));
    this.selectedAssigned$ = this.store
      .select(fromAssignSchedule.selectSelectedAssigned)
      .pipe(takeUntil(this.destroy$));

    this.handleSomeAssignedChecked();
    this.handleDiscardAssign();
  }

  /** PRIVATE METHODS */
  private handleSomeAssignedChecked(): void {
    this.someAssignedCheckedChange$ = this.selectedAssigned$.pipe(
      map((assigned) => assigned.some((x) => x)),
      distinctUntilChanged()
    );
  }

  private handleDiscardAssign(): void {
    this.discardAssign$
      .pipe(
        withLatestFrom(this.assigned$, this.selectedAssigned$),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(([_, needAssign, selected]) => {
          this.store.dispatch(
            fromAssignSchedule.unassign({
              classIds: needAssign
                .filter((_, i) => selected[i])
                .map((x) => x.id),
            })
          );
        })
      )
      .subscribe();
  }
}
