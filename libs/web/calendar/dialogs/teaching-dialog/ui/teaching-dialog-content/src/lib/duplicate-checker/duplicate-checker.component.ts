import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { fadeIn } from '@teaching-scheduling-system/core/ui/animations';
import { TeachingDialogStore } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { StudyScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'tss-duplicate-checker',
  templateUrl: './duplicate-checker.component.html',
  styleUrls: ['./duplicate-checker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  constructor(store: TeachingDialogStore) {
    this.searchStatus$ = store.status$('search');
    this.searchSchedule$ = store.searchSchedule$;
  }
}
