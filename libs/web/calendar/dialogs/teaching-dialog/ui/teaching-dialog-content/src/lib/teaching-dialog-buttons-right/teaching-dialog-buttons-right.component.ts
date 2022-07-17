import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  teachingDialogSelectChangeStatus,
  teachingDialogSelectRequestingChangeSchedule,
  teachingDialogSelectRequestStatus,
  teachingDialogSelectUpdateStatus,
  TeachingDialogState,
  teachingDialogToggleRequestChange,
  teachingDialogUpdate,
} from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-teaching-dialog-buttons-right',
  templateUrl: './teaching-dialog-buttons-right.component.html',
  styleUrls: ['./teaching-dialog-buttons-right.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class TeachingDialogButtonsRightComponent implements OnInit {
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

  /** GETTERS */
  private get noteControl(): FormControl {
    return (this.form.controls['change'] as FormGroup).controls[
      'note'
    ] as FormControl;
  }

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly controlContainer: ControlContainer,
    private readonly store: Store<TeachingDialogState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.changeStatus$ = store
      .select(teachingDialogSelectChangeStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestStatus$ = store
      .select(teachingDialogSelectRequestStatus)
      .pipe(takeUntil(this.destroy$));
    this.updateStatus$ = store
      .select(teachingDialogSelectUpdateStatus)
      .pipe(takeUntil(this.destroy$));
    this.requestingChangeSchedule$ = store
      .select(teachingDialogSelectRequestingChangeSchedule)
      .pipe(takeUntil(this.destroy$));
  }

  /** LIFECYCLE */
  public ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }

  /** PUBLIC METHODS */
  public fold(): void {
    this.store.dispatch(teachingDialogToggleRequestChange({ open: false }));
  }

  public onUpdate(): void {
    const body = {
      note: this.noteControl.value as string,
    };

    this.store.dispatch(teachingDialogUpdate({ id: this.idSchedule, body }));
  }

  public markForCheck(): void {
    this.cdr.markForCheck();
  }
}
