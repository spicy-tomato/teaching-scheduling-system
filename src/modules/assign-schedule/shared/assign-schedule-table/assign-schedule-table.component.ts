import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { CoreConstant } from '@constants/core/core.constant';
import { ModuleClass } from '@models/class/module-class.model';
import { BaseComponent } from '@modules/core/base/base.component';
import { Action, Store } from '@ngrx/store';
import { defaultSort } from '@taiga-ui/addon-table';
import { Observable } from 'rxjs';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import * as fromAssignSchedule from '../../state';

@Component({
  selector: 'tss-assign-schedule-table',
  templateUrl: './assign-schedule-table.component.html',
  styleUrls: ['./assign-schedule-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignScheduleTableComponent
  extends BaseComponent
  implements OnChanges
{
  /** INPUT */
  @Input() public data!: ModuleClass[];
  @Input() public excludeTeacher = false;
  @Input() public checkboxChangeAction!: (checkbox: boolean[]) => Action;

  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public status$: Observable<EApiStatus>;
  public readonly EApiStatus = EApiStatus;
  public readonly columns = [
    'checkbox',
    'index',
    'name',
    'credit',
    'classType',
    'numberPlan',
    'teacher',
  ];
  public _selectAll = false;
  public classType = CoreConstant.CLASS_TYPE;
  public defaultSort = defaultSort;

  /** GETTER */
  public get selectAll(): boolean {
    return this._selectAll;
  }

  /** SETTER */
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
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>
  ) {
    super();
    this.status$ = store.select(fromAssignSchedule.selectStatus);
  }

  /** LIFE CYCLE */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
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
