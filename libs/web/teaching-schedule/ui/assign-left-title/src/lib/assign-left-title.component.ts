import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  TuiAlertService,
  tuiButtonOptionsProvider,
  TuiNotification,
} from '@taiga-ui/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ModuleClass,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { AssignStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  switchMap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'tss-assign-left-title',
  templateUrl: './assign-left-title.component.html',
  styleUrls: ['./assign-left-title.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 's',
    }),
  ],
})
export class AssignLeftTitleComponent {
  // PUBLIC PROPERTIES
  teachers$: Observable<SimpleModel[]>;
  needAssign$: Observable<ModuleClass[]>;
  assignStatus$: Observable<EApiStatus>;
  selectedTeacher$: Observable<Nullable<SimpleModel>>;
  someNeedAssignCheckedChange$!: Observable<boolean>;

  // PRIVATE PROPERTIES
  private actionCount$: Observable<number>;
  private assignedTeacher$: Observable<Nullable<SimpleModel>>;

  // CONSTRUCTOR
  constructor(
    private readonly store: AssignStore,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {
    this.needAssign$ = this.store.needAssign$;
    this.teachers$ = this.store.teacher$('data');
    this.assignStatus$ = this.store.status$('assign');
    this.actionCount$ = this.store.teacher$('actionCount');
    this.assignedTeacher$ = this.store.teacher$('action');
    this.selectedTeacher$ = this.store.teacher$('selected');

    this.handleSomeNeedAssignChecked();
    this.handleAssignSuccessful();
  }

  // PUBLIC METHODS
  selectedTeacherChange(teacher: Nullable<SimpleModel>): void {
    this.store.changeSelectedTeacher(teacher);
  }

  assign(): void {
    this.store.assign();
  }

  // PRIVATE METHODS
  private handleSomeNeedAssignChecked(): void {
    this.someNeedAssignCheckedChange$ = this.store.selectedNeedAssign$.pipe(
      map((needAssign) => needAssign.some((x) => x)),
      distinctUntilChanged()
    );
  }

  private handleAssignSuccessful(): void {
    this.assignStatus$
      .pipe(
        withLatestFrom(
          this.assignedTeacher$,
          this.store.teacher$('actionCount')
        ),
        map(([status, teacher, count]) => ({ status, teacher, count })),
        filter(({ status, count }) => status === 'successful' && !!count),
        ObservableHelper.filterNullishProp(['teacher']),
        switchMap(({ teacher, count }) =>
          this.alertService.open(
            `Đã phân công ${count} lớp cho giảng viên\n ${teacher.name}`,
            { status: TuiNotification.Success }
          )
        )
      )
      .subscribe();
  }
}
