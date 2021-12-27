import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { fadeInOut } from '@animations/fade.animation';
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
import * as fromAssignSchedule from './state';

@Component({
  selector: 'tss-assign-schedule',
  templateUrl: './assign-schedule.component.html',
  styleUrls: ['./assign-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
export class AssignScheduleComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public selectedTeacher: SimpleModel | null = null;
  public teachers$: Observable<SimpleModel[]>;
  public needAssign$: Observable<ModuleClass[]>;
  public selectedNeedAssign$: Observable<boolean[]>;
  public selectedAssigned$: Observable<boolean[]>;
  public someNeedAssignCheckedChange$!: Observable<boolean>;
  public assign$ = new Subject<void>();
  public assignedTeacher$: Observable<{
    teacherName: string;
    classCount: number;
  }>;

  /** PRIVATE PROPERTIES */

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    this.store.dispatch(fromAssignSchedule.reset());

    this.teachers$ = this.store
      .select(fromAssignSchedule.selectTeachers)
      .pipe(takeUntil(this.destroy$));
    this.needAssign$ = this.store
      .select(fromAssignSchedule.selectNeedAssign)
      .pipe(takeUntil(this.destroy$));
    this.selectedNeedAssign$ = this.store
      .select(fromAssignSchedule.selectSelectedNeedAssign)
      .pipe(takeUntil(this.destroy$));
    this.selectedAssigned$ = this.store
      .select(fromAssignSchedule.selectSelectedAssigned)
      .pipe(takeUntil(this.destroy$));
    this.assignedTeacher$ = this.store
      .select(fromAssignSchedule.selectAssignedSuccessful)
      .pipe(takeUntil(this.destroy$));

    this.handleSomeCheckboxChecked();
    this.handleAssign();
    this.handleAssignSuccessful();
  }

  /** PUBLIC METHODS */
  private handleAssign(): void {
    this.assign$
      .pipe(
        withLatestFrom(this.needAssign$, this.selectedNeedAssign$),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(([_, needAssign, selected]) => {
          if (!this.selectedTeacher) {
            return;
          }

          this.store.dispatch(
            fromAssignSchedule.assign({
              teacher: this.selectedTeacher,
              classIds: needAssign
                .filter((_, i) => selected[i])
                .map((x) => x.id),
            })
          );
        })
      )
      .subscribe();
  }

  /** PRIVATE METHODS */
  private handleSomeCheckboxChecked(): void {
    this.someNeedAssignCheckedChange$ = this.selectedNeedAssign$.pipe(
      map((needAssign) => needAssign.some((x) => x)),
      distinctUntilChanged()
    );
  }

  private handleAssignSuccessful(): void {
    this.assignedTeacher$
      .pipe(
        tap(({ teacherName, classCount }) => {
          if (!teacherName || !classCount) {
            return;
          }

          this.notificationsService
            .show(
              `Đã phân công ${classCount} lớp cho giảng viên\n ${teacherName}`,
              { status: TuiNotification.Success }
            )
            .subscribe();
        })
      )
      .subscribe();
  }
}
