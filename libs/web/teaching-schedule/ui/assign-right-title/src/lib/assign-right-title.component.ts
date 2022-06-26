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
  teachingScheduleAssignSelectActionCountTeacher,
  teachingScheduleAssignSelectActionTeacher,
  teachingScheduleAssignSelectAssigned,
  teachingScheduleAssignSelectSelectedAssigned,
  teachingScheduleAssignSelectUnassignStatus,
  TeachingScheduleAssignState,
  teachingScheduleAssignUnassign,
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
  selector: 'tss-assign-right-title',
  templateUrl: './assign-right-title.component.html',
  styleUrls: ['./assign-right-title.component.css'],
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
export class AssignRightTitleComponent {
  /** PUBLIC PROPERTIES */
  public assigned$: Observable<ModuleClass[]>;
  public selectedAssigned$: Observable<boolean[]>;
  public someAssignedCheckedChange$!: Observable<boolean>;
  public unassignStatus$: Observable<EApiStatus>;
  public unassign$ = new Subject<void>();
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
    this.assigned$ = this.store
      .select(teachingScheduleAssignSelectAssigned)
      .pipe(takeUntil(this.destroy$));
    this.selectedAssigned$ = this.store
      .select(teachingScheduleAssignSelectSelectedAssigned)
      .pipe(takeUntil(this.destroy$));
    this.assignedTeacher$ = this.store
      .select(teachingScheduleAssignSelectActionTeacher)
      .pipe(takeUntil(this.destroy$));
    this.unassignStatus$ = this.store
      .select(teachingScheduleAssignSelectUnassignStatus)
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
            teachingScheduleAssignUnassign({
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
          this.store.select(teachingScheduleAssignSelectActionCountTeacher)
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
