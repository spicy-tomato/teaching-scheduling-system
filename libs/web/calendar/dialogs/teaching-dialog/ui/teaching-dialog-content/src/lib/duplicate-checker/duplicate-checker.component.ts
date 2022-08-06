import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { fadeIn } from '@teaching-scheduling-system/core/ui/animations';
import {
  teachingDialogSelectSearchSchedule,
  teachingDialogSelectSearchStatus,
  TeachingDialogState,
} from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { StudyScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-duplicate-checker',
  templateUrl: './duplicate-checker.component.html',
  styleUrls: ['./duplicate-checker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
  animations: [fadeIn],
})
export class DuplicateCheckerComponent {
  // INPUT
  @Input() sameData!: boolean;
  @Input() hadReason!: boolean;

  // PUBLIC PROPERTIES
  readonly searchStatus$: Observable<EApiStatus>;
  readonly searchSchedule$: Observable<Nullable<StudyScheduleModel[]>>;

  // CONSTRUCTOR
  constructor(
    private readonly destroy$: TuiDestroyService,
    store: Store<TeachingDialogState>
  ) {
    this.searchStatus$ = store
      .select(teachingDialogSelectSearchStatus)
      .pipe(takeUntil(this.destroy$));
    this.searchSchedule$ = store
      .select(teachingDialogSelectSearchSchedule)
      .pipe(takeUntil(this.destroy$));
  }
}
