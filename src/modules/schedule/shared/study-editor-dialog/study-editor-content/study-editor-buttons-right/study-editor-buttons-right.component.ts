import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromStudyEditorDialog from '../state';

@Component({
  selector: 'tss-study-editor-buttons-right',
  templateUrl: './study-editor-buttons-right.component.html',
  styleUrls: ['./study-editor-buttons-right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyEditorButtonsRightComponent
  extends BaseComponent
  implements OnInit
{
  /** INPUT */
  @Input() public idSchedule!: number;

  /** OUTPUT */
  @Output() public cancel = new EventEmitter();

  /** PUBLIC PROPERTIES */
  public form!: FormGroup;

  public readonly changeStatus$: Observable<EApiStatus>;
  public readonly requestStatus$: Observable<EApiStatus>;
  public readonly updateStatus$: Observable<EApiStatus>;
  public readonly requestingChangeSchedule$: Observable<boolean>;

  public readonly EApiStatus = EApiStatus;

  /** GETTERS */
  private get noteControl(): FormControl {
    return (this.form.controls['change'] as FormGroup).controls[
      'note'
    ] as FormControl;
  }

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly controlContainer: ControlContainer,
    private readonly store: Store<fromStudyEditorDialog.StudyEditorDialogState>
  ) {
    super();

    this.changeStatus$ = store
      .select(fromStudyEditorDialog.selectChangeStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestStatus$ = store
      .select(fromStudyEditorDialog.selectRequestStatus)
      .pipe(takeUntil(this.destroy$));
    this.updateStatus$ = store
      .select(fromStudyEditorDialog.selectUpdateStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestingChangeSchedule$ = store
      .select(fromStudyEditorDialog.selectRequestingChangeSchedule)
      .pipe(takeUntil(this.destroy$));
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }

  /** PUBLIC METHODS */
  public fold(): void {
    this.store.dispatch(
      fromStudyEditorDialog.toggleRequestChange({ open: false })
    );
  }

  public onUpdate(): void {
    const body = {
      note: this.noteControl.value as string,
    };

    this.store.dispatch(
      fromStudyEditorDialog.update({ id: this.idSchedule, body })
    );
  }

  public markForCheck(): void {
    this.cdr.markForCheck();
  }
}
