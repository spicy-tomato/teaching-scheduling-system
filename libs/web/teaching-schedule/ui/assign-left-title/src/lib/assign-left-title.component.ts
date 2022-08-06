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
  teachingScheduleAssign_Assign,
  teachingScheduleAssign_ChangeSelectingTeacher,
  teachingScheduleAssign_SelectActionCountTeacher,
  teachingScheduleAssign_SelectActionTeacher,
  teachingScheduleAssign_SelectAssignStatus,
  teachingScheduleAssign_SelectNeedAssign,
  teachingScheduleAssign_SelectSelectedNeedAssign,
  teachingScheduleAssign_SelectSelectedTeacher,
  teachingScheduleAssign_SelectTeachers,
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
  selector: 'tss-assign-left-title',
  templateUrl: './assign-left-title.component.html',
  styleUrls: ['./assign-left-title.component.css'],
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
export class AssignLeftTitleComponent {
  /** PUBLIC PROPERTIES */
  needAssign$: Observable<ModuleClass[]>;
  teachers$: Observable<SimpleModel[]>;
  selectedTeacher$: Observable<Nullable<SimpleModel>>;
  someNeedAssignCheckedChange$!: Observable<boolean>;
  selectedNeedAssign$: Observable<ModuleClass[]>;
  assignStatus$: Observable<EApiStatus>;

  /** PRIVATE PROPERTIES */
  private assignedTeacher$: Observable<Nullable<SimpleModel>>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<TeachingScheduleAssignState>,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private readonly destroy$: TuiDestroyService
  ) {
    this.teachers$ = this.store
      .select(teachingScheduleAssign_SelectTeachers)
      .pipe(takeUntil(this.destroy$));
    this.needAssign$ = this.store
      .select(teachingScheduleAssign_SelectNeedAssign)
      .pipe(takeUntil(this.destroy$));
    this.selectedNeedAssign$ = this.store
      .select(teachingScheduleAssign_SelectSelectedNeedAssign)
      .pipe(takeUntil(this.destroy$));
    this.selectedTeacher$ = this.store
      .select(teachingScheduleAssign_SelectSelectedTeacher)
      .pipe(takeUntil(this.destroy$));
    this.assignedTeacher$ = this.store
      .select(teachingScheduleAssign_SelectActionTeacher)
      .pipe(takeUntil(this.destroy$));
    this.assignStatus$ = this.store
      .select(teachingScheduleAssign_SelectAssignStatus)
      .pipe(takeUntil(this.destroy$));

    this.handleSomeNeedAssignChecked();
    this.handleAssignSuccessful();
  }

  /** PUBLIC METHODS */
  selectedTeacherChange(teacher: Nullable<SimpleModel>): void {
    this.store.dispatch(
      teachingScheduleAssign_ChangeSelectingTeacher({ teacher })
    );
  }

  assign(): void {
    this.store.dispatch(teachingScheduleAssign_Assign());
  }

  /** PRIVATE METHODS */
  private handleSomeNeedAssignChecked(): void {
    this.someNeedAssignCheckedChange$ = this.selectedNeedAssign$.pipe(
      map((needAssign) => needAssign.some((x) => x)),
      distinctUntilChanged()
    );
  }

  private handleAssignSuccessful(): void {
    this.assignedTeacher$
      .pipe(
        withLatestFrom(
          this.store.select(teachingScheduleAssign_SelectActionCountTeacher)
        ),
        tap(([teacher, count]) => {
          if (!teacher) {
            return;
          }
          this.alertService
            .open(
              `Đã phân công ${count} lớp cho giảng viên\n ${teacher.name}`,
              { status: TuiNotification.Success }
            )
            .subscribe();
        })
      )
      .subscribe();
  }
}
