import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { ModuleClass } from '@teaching-scheduling-system/web/shared/data-access/models';
import { AssignStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'tss-assign-table',
  templateUrl: './assign-table.component.html',
  styleUrls: ['./assign-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignTableComponent implements OnChanges {
  // INPUT
  @Input() data!: ModuleClass[];
  @Input() excludeTeacher = false;

  // PUBLIC PROPERTIES
  readonly columns = [
    'checkbox',
    'index',
    'name',
    'credit',
    'type',
    'numberReality',
    'teacher',
  ];
  readonly classType = CoreConstant.CLASS_TYPE;
  readonly filterStatus$: Observable<EApiStatus>;
  form!: FormGroup;

  // PRIVATE PROPERTIES
  private _selectAll = false;

  // GETTERS
  get checkboxes(): FormArray {
    return this.form.controls['checkbox'] as FormArray;
  }

  get selectAll(): boolean {
    return this._selectAll;
  }

  // SETTERS
  set selectAll(checked: boolean) {
    this.checkboxes.controls.forEach((checkbox) => {
      checkbox.setValue(checked);
    });

    this.store.changeSelected(
      this.data.map(({ id }) => id),
      checked
    );
  }

  // CONSTRUCTOR
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: AssignStore
  ) {
    this.filterStatus$ = store.status$('filter');
  }

  // LIFECYCLE
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.resetForm();
    }
  }

  // PUBLIC METHODS
  onModelChange(id: string, checked: boolean): void {
    if (
      this._selectAll &&
      this.checkboxes.controls.some(({ value }) => !value)
    ) {
      this._selectAll = false;
    } else if (
      !this._selectAll &&
      this.checkboxes.controls.every(({ value }) => value)
    ) {
      this._selectAll = true;
    }

    this.store.changeSelected([id], checked);
  }

  getCheckbox(i: number): FormControl {
    return this.checkboxes.at(i) as FormControl;
  }

  // PRIVATE METHODS
  private resetForm(): void {
    this.form = this.fb.group({
      checkbox: this.fb.array(this.data.map(() => false)),
    });
    this._selectAll = false;
  }
}
