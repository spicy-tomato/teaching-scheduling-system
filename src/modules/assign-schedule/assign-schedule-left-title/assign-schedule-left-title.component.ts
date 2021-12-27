import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { fadeInOut } from '@animations/fade.animation';
import { ModuleClass } from '@models/class/module-class.model';
import { SimpleModel } from '@models/core/simple.model';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { TuiNotificationsService, TuiNotification } from '@taiga-ui/core';
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
  selector: 'tss-assign-schedule-left-title',
  templateUrl: './assign-schedule-left-title.component.html',
  styleUrls: ['./assign-schedule-left-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
export class AssignScheduleLeftTitleComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public needAssign$: Observable<ModuleClass[]>;
  public teachers$: Observable<SimpleModel[]>;
  public selectedTeacher: SimpleModel | null = null;
  public someNeedAssignCheckedChange$!: Observable<boolean>;
  public selectedNeedAssign$: Observable<boolean[]>;
  public assign$ = new Subject<void>();

  /** PRIVATE PROPERTIES */
  private assignedTeacher$: Observable<SimpleModel | null>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    this.teachers$ = this.store
      .select(fromAssignSchedule.selectTeachers)
      .pipe(takeUntil(this.destroy$));
    this.needAssign$ = this.store
      .select(fromAssignSchedule.selectNeedAssign)
      .pipe(takeUntil(this.destroy$));
    this.selectedNeedAssign$ = this.store
      .select(fromAssignSchedule.selectSelectedNeedAssign)
      .pipe(takeUntil(this.destroy$));

    this.assignedTeacher$ = this.store
      .select(fromAssignSchedule.selectActionTeacher)
      .pipe(takeUntil(this.destroy$));

    this.handleSomeNeedAssignChecked();
    this.handleAssign();
    this.handleAssignSuccessful();
  }

  /** PUBLIC METHODS */
  public selectedTeacherChange(teacher: SimpleModel | null): void {}

  /** PRIVATE METHODS */
  private handleSomeNeedAssignChecked(): void {
    this.someNeedAssignCheckedChange$ = this.selectedNeedAssign$.pipe(
      map((needAssign) => needAssign.some((x) => x)),
      distinctUntilChanged()
    );
  }

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

  private handleAssignSuccessful(): void {
    this.assignedTeacher$
      .pipe(
        withLatestFrom(
          this.store.select(fromAssignSchedule.selectActionCountTeacher)
        ),
        tap(([teacher, count]) => {
          if (!teacher) {
            return;
          }
          this.notificationsService
            .show(
              `Đã phân công ${count} lớp cho giảng viên\n ${teacher.name}`,
              { status: TuiNotification.Success }
            )
            .subscribe();
        })
      )
      .subscribe();
  }
}
