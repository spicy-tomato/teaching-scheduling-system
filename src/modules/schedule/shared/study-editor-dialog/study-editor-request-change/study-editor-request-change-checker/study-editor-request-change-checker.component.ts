import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { fadeIn } from '@shared/animations';
import { EApiStatus } from '@shared/enums';
import { Nullable, StudyScheduleModel } from '@shared/models';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromStudyEditorDialog from '../../state';

@Component({
  selector: 'tss-study-editor-request-change-checker',
  templateUrl: './study-editor-request-change-checker.component.html',
  styleUrls: ['./study-editor-request-change-checker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
})
export class StudyEditorRequestChangeCheckerComponent extends BaseComponent {
  /** INPUTS */
  @Input() public sameData!: boolean;
  @Input() public hadReason!: boolean;

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
