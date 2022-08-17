import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  TuiAlertService,
  tuiButtonOptionsProvider,
  TuiNotification,
} from '@taiga-ui/core';
import { fadeInOut } from '@teaching-scheduling-system/core/ui/animations';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { ModuleClass } from '@teaching-scheduling-system/web/shared/data-access/models';
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
  selector: 'tss-assign-right-title',
  templateUrl: './assign-right-title.component.html',
  styleUrls: ['./assign-right-title.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 's',
    }),
  ],
  animations: [fadeInOut],
})
export class AssignRightTitleComponent {
  // PUBLIC PROPERTIES
  assigned$: Observable<ModuleClass[]>;
  someAssignedCheckedChange$!: Observable<boolean>;
  unassignStatus$: Observable<EApiStatus>;

  // CONSTRUCTOR
  constructor(
    private readonly store: AssignStore,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {
    this.assigned$ = this.store.assigned$;
    this.unassignStatus$ = this.store.status$('unassign');

    this.handleSomeAssignedChecked();
    this.handleUnassignSuccessful();
  }

  // PUBLIC METHODS
  unassign(): void {
    this.store.unassign();
  }

  // PRIVATE METHODS
  private handleSomeAssignedChecked(): void {
    this.someAssignedCheckedChange$ = this.store.selectedAssigned$.pipe(
      map((assigned) => assigned.some((x) => x)),
      distinctUntilChanged()
    );
  }

  private handleUnassignSuccessful(): void {
    this.unassignStatus$
      .pipe(
        withLatestFrom(this.store.teacher$('actionCount')),
        filter(([status, count]) => status === 'successful' && !!count),
        switchMap(({ 1: count }) =>
          this.alertService.open(`Đã hủy phân công ${count} lớp học phần`, {
            status: TuiNotification.Success,
          })
        )
      )
      .subscribe();
  }
}
