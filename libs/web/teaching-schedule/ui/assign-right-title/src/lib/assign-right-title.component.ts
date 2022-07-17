import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  tuiButtonOptionsProvider,
  TuiNotification,
} from '@taiga-ui/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { fadeInOut } from '@teaching-scheduling-system/core/ui/animations';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ModuleClass,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  TeachingScheduleAssignState,
  teachingScheduleAssign_SelectActionCountTeacher,
  teachingScheduleAssign_SelectActionTeacher,
  teachingScheduleAssign_SelectAssigned,
  teachingScheduleAssign_SelectSelectedAssigned,
  teachingScheduleAssign_SelectUnassignStatus,
  teachingScheduleAssign_Unassign,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import {
  distinctUntilChanged,
  map,
  Observable,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'tss-assign-right-title',
  templateUrl: './assign-right-title.component.html',
  styleUrls: ['./assign-right-title.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 's',
    }),
  ],
  animations: [fadeInOut],
})
export class AssignRightTitleComponent {
  /** PUBLIC PROPERTIES */
  public assigned$: Observable<ModuleClass[]>;
  public someAssignedCheckedChange$!: Observable<boolean>;
  public unassignStatus$: Observable<EApiStatus>;

  /** PRIVATE PROPERTIES */
  private assignedTeacher$: Observable<Nullable<SimpleModel>>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<TeachingScheduleAssignState>,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private readonly destroy$: TuiDestroyService
  ) {
    this.assigned$ = this.store
      .select(teachingScheduleAssign_SelectAssigned)
      .pipe(takeUntil(this.destroy$));
    this.assignedTeacher$ = this.store
      .select(teachingScheduleAssign_SelectActionTeacher)
      .pipe(takeUntil(this.destroy$));
    this.unassignStatus$ = this.store
      .select(teachingScheduleAssign_SelectUnassignStatus)
      .pipe(takeUntil(this.destroy$));

    this.handleSomeAssignedChecked();
    this.handleUnassignSuccessful();
  }

  /** PUBLIC METHODS */
  public unassign(): void {
    this.store.dispatch(teachingScheduleAssign_Unassign());
  }

  /** PRIVATE METHODS */
  private handleSomeAssignedChecked(): void {
    this.someAssignedCheckedChange$ = this.store
      .select(teachingScheduleAssign_SelectSelectedAssigned)
      .pipe(
        map((assigned) => assigned.some((x) => x)),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      );
  }

  private handleUnassignSuccessful(): void {
    this.assignedTeacher$
      .pipe(
        withLatestFrom(
          this.store.select(teachingScheduleAssign_SelectActionCountTeacher)
        ),
        tap(([teacher, count]) => {
          if (teacher || count === 0) {
            return;
          }
          this.alertService
            .open(`Đã hủy phân công ${count} lớp học phần`, {
              status: TuiNotification.Success,
            })
            .subscribe();
        })
      )
      .subscribe();
  }
}
