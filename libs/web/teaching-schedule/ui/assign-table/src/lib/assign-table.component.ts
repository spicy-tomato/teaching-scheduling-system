import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Action, Store } from '@ngrx/store';
import { defaultSort } from '@taiga-ui/addon-table';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { ModuleClass } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  teachingScheduleAssignSelectFilterStatus,
  TeachingScheduleAssignState
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-assign-table',
  templateUrl: './assign-table.component.html',
  styleUrls: ['./assign-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AssignTableComponent implements OnChanges {
  /** INPUT */
  @Input() public data!: ModuleClass[];
  @Input() public excludeTeacher = false;
  @Input() public checkboxChangeAction!: (checkbox: boolean[]) => Action;

  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public filterStatus$: Observable<EApiStatus>;
  public readonly EApiStatus = EApiStatus;
  public readonly columns = [
    'checkbox',
    'index',
    'name',
    'credit',
    'type',
    'numberReality',
    'teacher',
  ];
  public classType = CoreConstant.CLASS_TYPE;
  public defaultSort = defaultSort;

  /** PRIVATE PROPERTIES */
  public _selectAll = false;

  /** GETTERS */
  public get selectAll(): boolean {
    return this._selectAll;
  }

  /** SETTERS */
  public set selectAll(checkAll: boolean) {
    this.checkboxes.forEach((checkbox) => {
      checkbox.setValue(checkAll);
    });
  }

  public get checkboxes(): AbstractControl[] {
    return (this.form.get('checkbox') as FormArray)?.controls;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<TeachingScheduleAssignState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.filterStatus$ = store
      .select(teachingScheduleAssignSelectFilterStatus)
      .pipe(takeUntil(this.destroy$));
  }

  /** LIFE CYCLE */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.resetForm();
    }
  }

  /** PUBLIC METHODS */
  public onModelChange(): void {
    if (
      this._selectAll &&
      this.checkboxes.some((checkbox) => !checkbox.value)
    ) {
      this._selectAll = false;
    } else if (
      !this._selectAll &&
      this.checkboxes.every((checkbox) => checkbox.value)
    ) {
      this._selectAll = true;
    }

    this.store.dispatch(
      this.checkboxChangeAction(this.checkboxes.map((x) => x.value as boolean))
    );
  }

  /** PRIVATE METHODS */
  private resetForm(): void {
    this.form = this.fb.group({
      checkbox: this.fb.array(this.data.map(() => false)),
    });
    this._selectAll = false;
  }
}
