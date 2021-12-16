import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TuiMonth } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiHostedDropdownComponent,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { Observable } from 'rxjs';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { PermissionConstant } from '@constants/core/permission.constant';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import * as fromSchedule from '@modules/schedule/state';

@Component({
  selector: 'tss-schedule-header',
  templateUrl: './schedule-header.component.html',
  styleUrls: ['./schedule-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: 'square',
        appearance: TuiAppearance.Flat,
        size: 'xs',
      },
    },
  ],
})
export class ScheduleHeaderComponent extends BaseComponent {
  /** INPUT */
  @Input() public dateRange!: string;
  @Input() public view!: 'Month' | 'Week' | 'Day';
  @Input() public month!: TuiMonth;

  /** OUTPUT */
  @Output() public prev = new EventEmitter<void>();
  @Output() public next = new EventEmitter<void>();
  @Output() public chooseMonth = new EventEmitter<TuiMonth>();
  @Output() public clickToday = new EventEmitter<void>();
  @Output() public clickMonth = new EventEmitter<void>();
  @Output() public clickWeek = new EventEmitter<void>();
  @Output() public clickDay = new EventEmitter<void>();

  /** VIEWCHILD */
  @ViewChild(TuiHostedDropdownComponent)
  public hostedDropdown?: TuiHostedDropdownComponent;

  /** PUBLIC PROPERTIES */
  public permissions$!: Observable<number[] | undefined>;
  public openSelectMonth = false;
  public filterForm!: FormGroup;
  public activateFilterButton$!: Observable<boolean>;
  public openFilter = false;
  public readonly permissionConstant = PermissionConstant;

  /** GETTERS */
  private get showDepartmentSchedule(): AbstractControl | null {
    return this.filterForm.get('showDepartmentSchedule');
  }

  /** CONSTRUCTOR */
  constructor(
    private fb: FormBuilder,
    private store: Store<fromSchedule.ScheduleState>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
  }

  /** PUBLIC METHODS */
  public onSelectMonth(month: TuiMonth): void {
    this.openSelectMonth = false;
    this.chooseMonth.next(month);
  }

  public filter(): void {
    const departmentSchedule =
      (this.showDepartmentSchedule?.value as boolean) ?? false;
    this.store.dispatch(fromSchedule.load({ departmentSchedule }));
    this.openFilter = false;
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.filterForm = this.fb.group({
      showDepartmentSchedule: [false],
    });
  }
}
