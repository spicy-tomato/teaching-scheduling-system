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
import { Store } from '@ngrx/store';
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
    store: Store<fromAssignSchedule.AssignScheduleState>
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
  }

  /** PRIVATE METHODS */
  private resetForm(): void {
    this.form = this.fb.group({
      checkbox: this.fb.array(this.data.map(() => false)),
    });
  }
}
