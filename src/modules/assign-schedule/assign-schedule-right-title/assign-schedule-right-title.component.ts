import { Component, Inject } from '@angular/core';
import { ModuleClass } from '@models/class/module-class.model';
import { SimpleModel } from '@models/core/simple.model';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
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
  /** PUBLIC PROPERTIES */
  public assigned$: Observable<ModuleClass[]>;
  public selectedAssigned$: Observable<boolean[]>;
  public someAssignedCheckedChange$!: Observable<boolean>;
  public unassign$ = new Subject<void>();

  /** PRIVATE PROPERTIES */
  private assignedTeacher$: Observable<SimpleModel | null>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    this.assigned$ = this.store
      .select(fromAssignSchedule.selectAssigned)
      .pipe(takeUntil(this.destroy$));
    this.selectedAssigned$ = this.store
      .select(fromAssignSchedule.selectSelectedAssigned)
      .pipe(takeUntil(this.destroy$));
    this.assignedTeacher$ = this.store
      .select(fromAssignSchedule.selectActionTeacher)
      .pipe(takeUntil(this.destroy$));

    this.handleSomeAssignedChecked();
    this.handleUnassign();
    this.handleUnassignSuccessful();
  }

  /** PRIVATE METHODS */
  private handleSomeAssignedChecked(): void {
    this.someAssignedCheckedChange$ = this.selectedAssigned$.pipe(
      map((assigned) => assigned.some((x) => x)),
      distinctUntilChanged()
    );
  }

  private handleUnassign(): void {
    this.unassign$
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

  private handleUnassignSuccessful(): void {
    this.assignedTeacher$
      .pipe(
        withLatestFrom(
          this.store.select(fromAssignSchedule.selectActionCountTeacher)
        ),
        tap(([teacher, count]) => {
          if (teacher || count === 0) {
            return;
          }
          this.notificationsService
            .show(`Đã hủy phân công ${count} lớp học phần`, {
              status: TuiNotification.Success,
            })
            .subscribe();
        })
      )
      .subscribe();
  }
}
