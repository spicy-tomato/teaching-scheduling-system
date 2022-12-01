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
import { TeachingDialogStore } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { Observable } from 'rxjs';

@Component({
  selector: 'tss-teaching-dialog-buttons-right',
  templateUrl: './teaching-dialog-buttons-right.component.html',
  styleUrls: ['./teaching-dialog-buttons-right.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeachingDialogButtonsRightComponent implements OnInit {
  // INPUT
  @Input() idSchedule!: number | string;

  // OUTPUT
  @Output() cancel = new EventEmitter();

  // PUBLIC PROPERTIES
  form!: FormGroup;

  readonly changeStatus$: Observable<EApiStatus>;
  readonly requestStatus$: Observable<EApiStatus>;
  readonly updateStatus$: Observable<EApiStatus>;
  readonly requestingChangeSchedule$: Observable<boolean>;

  // GETTERS
  private get noteControl(): FormControl {
    return (this.form.controls['change'] as FormGroup).controls[
      'note'
    ] as FormControl;
  }

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly controlContainer: ControlContainer,
    private readonly store: TeachingDialogStore
  ) {
    this.changeStatus$ = store.status$('change');
    this.updateStatus$ = store.status$('update');
    this.requestStatus$ = store.status$('request');
    this.requestingChangeSchedule$ = store.requestingChangeSchedule$;
  }

  // LIFECYCLE
  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }

  // PUBLIC METHODS
  fold(): void {
    this.store.toggleRequest(false);
  }

  onUpdate(): void {
    if (typeof this.idSchedule !== 'number') {
      return;
    }

    const payload = {
      note: this.noteControl.value as string,
    };
    this.store.update({ id: this.idSchedule, payload });
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }
}
