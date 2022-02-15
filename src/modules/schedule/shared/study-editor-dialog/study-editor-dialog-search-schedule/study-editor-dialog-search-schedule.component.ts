import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { fadeIn } from '@shared/animations';
import { EApiStatus } from '@shared/enums';
import { Nullable, StudyScheduleModel } from '@shared/models';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromStudyEditorDialog from '../state';

@Component({
  selector: 'tss-study-editor-dialog-search-schedule',
  templateUrl: './study-editor-dialog-search-schedule.component.html',
  styleUrls: ['./study-editor-dialog-search-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
})
export class StudyEditorDialogSearchScheduleComponent extends BaseComponent {
  /** INPUTS */
  @Input() public sameData!: Nullable<boolean>;

  /** PUBLIC PROPERTIES */
  public readonly searchStatus$: Observable<EApiStatus>;
  public readonly searchSchedule$: Observable<Nullable<StudyScheduleModel[]>>;
  public readonly EApiStatus = EApiStatus;

  /** CONSTRUCTOR */
  constructor(store: Store<fromStudyEditorDialog.StudyEditorDialogState>) {
    super();

    this.searchStatus$ = store
      .select(fromStudyEditorDialog.selectSearchStatus)
      .pipe(takeUntil(this.destroy$));
    this.searchSchedule$ = store
      .select(fromStudyEditorDialog.selectSearchSchedule)
      .pipe(takeUntil(this.destroy$));
  }
}
