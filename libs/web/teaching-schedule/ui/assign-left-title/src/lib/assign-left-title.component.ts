import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiNotification,
  TuiNotificationsService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { fadeInOut } from '@teaching-scheduling-system/core/ui/animations';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ModuleClass,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  teachingScheduleAssignAssign,
  teachingScheduleAssignChangeSelectingTeacher,
  teachingScheduleAssignSelectActionCountTeacher,
  teachingScheduleAssignSelectActionTeacher,
  teachingScheduleAssignSelectAssignStatus,
  teachingScheduleAssignSelectNeedAssign,
  teachingScheduleAssignSelectSelectedNeedAssign,
  teachingScheduleAssignSelectSelectedTeacher,
  teachingScheduleAssignSelectTeachers,
  TeachingScheduleAssignState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import {
  distinctUntilChanged,
  map,
  Observable,
  Subject,
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
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Primary,
        size: 's',
      },
    },
  ],
  animations: [fadeInOut],
})
export class AssignLeftTitleComponent {
  /** PUBLIC PROPERTIES */
  public needAssign$: Observable<ModuleClass[]>;
  public teachers$: Observable<SimpleModel[]>;
  public selectedTeacher$: Observable<Nullable<SimpleModel>>;
  public someNeedAssignCheckedChange$!: Observable<boolean>;
  public selectedNeedAssign$: Observable<boolean[]>;
  public assignStatus$: Observable<EApiStatus>;
  public assign$ = new Subject<void>();
  public readonly EApiStatus = EApiStatus;

  /** PRIVATE PROPERTIES */
  private assignedTeacher$: Observable<Nullable<SimpleModel>>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<TeachingScheduleAssignState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly destroy$: TuiDestroyService
  ) {
    this.teachers$ = this.store
      .select(teachingScheduleAssignSelectTeachers)
      .pipe(takeUntil(this.destroy$));
    this.needAssign$ = this.store
      .select(teachingScheduleAssignSelectNeedAssign)
      .pipe(takeUntil(this.destroy$));
    this.selectedNeedAssign$ = this.store
      .select(teachingScheduleAssignSelectSelectedNeedAssign)
      .pipe(takeUntil(this.destroy$));
    this.selectedTeacher$ = this.store
      .select(teachingScheduleAssignSelectSelectedTeacher)
      .pipe(takeUntil(this.destroy$));
    this.assignedTeacher$ = this.store
      .select(teachingScheduleAssignSelectActionTeacher)
      .pipe(takeUntil(this.destroy$));
    this.assignStatus$ = this.store
      .select(teachingScheduleAssignSelectAssignStatus)
      .pipe(takeUntil(this.destroy$));

    this.handleSomeNeedAssignChecked();
    this.handleAssign();
    this.handleAssignSuccessful();
  }

  /** PUBLIC METHODS */
  public selectedTeacherChange(teacher: Nullable<SimpleModel>): void {
    this.store.dispatch(
      teachingScheduleAssignChangeSelectingTeacher({ teacher })
    );
  }

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
        withLatestFrom(
          this.needAssign$,
          this.selectedNeedAssign$,
          this.selectedTeacher$
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(([_, needAssign, selected, selectedTeacher]) => {
          if (!selectedTeacher) {
            return;
          }

          this.store.dispatch(
            teachingScheduleAssignAssign({
              teacher: selectedTeacher,
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
          this.store.select(teachingScheduleAssignSelectActionCountTeacher)
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
