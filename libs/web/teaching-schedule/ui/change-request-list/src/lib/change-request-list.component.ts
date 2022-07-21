import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  PermissionConstant,
  TableConstant,
} from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ChangeStatusHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleStatus,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectPermission,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  teachingScheduleRequestChangeSelectExport,
  teachingScheduleRequestSelectChangeSchedules,
  teachingScheduleRequestSelectOptions,
  teachingScheduleRequestSelectPage,
  teachingScheduleRequestSelectStatus,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'tss-change-request-list',
  templateUrl: './change-request-list.component.html',
  styleUrls: ['./change-request-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ChangeRequestListComponent {
  /** VIEW CHILD */
  @ViewChild('teacherCol', { static: false, read: ElementRef })
  public teacherColumn!: ElementRef;

  /** PUBLIC PROPERTIES */
  public form: FormGroup = new FormGroup({});
  public teacherColumnWidth = 0;
  public checkAll: Nullable<boolean> = false;
  public checkableIndexes: number[] = [];
  public columns: string[] = [];
  public initialColumns = [
    'checkbox',
    'index',
    'teacher',
    'moduleClass',
    'oldDate',
    'newDate',
    'oldShift',
    'newShift',
    'reason',
    'createdAt',
    'status',
    'actions',
  ];

  public readonly changeSchedules$: Observable<ChangeSchedule[]>;
  public readonly status$: Observable<ChangeScheduleStatus>;
  public readonly page$: Observable<number>;
  public readonly options$: Observable<ChangeScheduleOptions>;
  public readonly permissions$: Observable<number[]>;

  public readonly isPersonal: boolean;

  public readonly itemsPerPage = TableConstant.REQUESTS_LIST_ITEMS_PER_PAGE;
  public readonly PermissionConstant = PermissionConstant;

  /** GETTER */
  private get checkboxControl(): FormArray {
    return this.form.controls['checkbox'] as FormArray;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly fb: FormBuilder,
    private readonly store: Store<TeachingScheduleRequestState>,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>,
    route: ActivatedRoute
  ) {
    this.options$ = store
      .select(teachingScheduleRequestSelectOptions)
      .pipe(takeUntil(this.destroy$));
    this.changeSchedules$ = store
      .select(teachingScheduleRequestSelectChangeSchedules)
      .pipe(takeUntil(this.destroy$));
    this.status$ = store
      .select(teachingScheduleRequestSelectStatus)
      .pipe(takeUntil(this.destroy$));
    this.page$ = store
      .select(teachingScheduleRequestSelectPage)
      .pipe(takeUntil(this.destroy$));
    this.permissions$ = appShellStore
      .select(selectPermission)
      .pipe(takeUntil(this.destroy$));

    this.isPersonal = route.snapshot.data['personal'] as boolean;

    this.configureColumns();
    this.handleOptionsChange();
    this.triggerDataChange();
  }

  /** PUBLIC METHODS */
  public onCheckAllChange(): void {
    const checkboxesValue = Array(this.checkboxControl.length).fill(false);
    if (this.checkAll) {
      this.checkableIndexes.forEach((idx) => {
        checkboxesValue[idx] = true;
      });
    }

    this.checkboxControl.patchValue(checkboxesValue, {
      onlySelf: true,
    });
  }

  public onCheckChange(checked: boolean): void {
    for (let i = 0; i < this.checkableIndexes.length; i++) {
      const index = this.checkableIndexes[i];
      if (this.checkboxControl.at(index).value !== checked) {
        this.checkAll = null;
        return;
      }
    }

    this.checkAll = checked;
  }

  /** PRIVATE METHODS */
  private configureColumns(): void {
    if (this.isPersonal) {
      this.initialColumns = this.initialColumns.filter((x) => x !== 'teacher');
    } else {
      this.initialColumns = this.initialColumns.filter((x) => x !== 'checkbox');
    }
  }

  private handleOptionsChange(): void {
    this.options$
      .pipe(
        map((option) => option.showReason),
        distinctUntilChanged(),
        tap((showReason) => {
          if (showReason) {
            this.columns = this.initialColumns;
          } else {
            this.columns = this.initialColumns.filter((x) => x !== 'reason');
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private triggerDataChange(): void {
    this.changeSchedules$
      .pipe(
        filter((changeSchedules) => changeSchedules.length > 0),
        distinctUntilChanged(),
        tap((changeSchedules) => {
          this.initForm(changeSchedules);
          this.resetCheckbox(changeSchedules);
          this.handleCheckboxChanges();
          this.calculateStickyColumn();
        })
      )
      .subscribe();
  }

  private initForm(changeSchedules: ChangeSchedule[]): void {
    this.form = this.fb.group({
      checkbox: this.fb.array(changeSchedules.map(() => false)),
    });
  }

  private resetCheckbox(changeSchedules: ChangeSchedule[]): void {
    this.checkAll = false;
    this.checkableIndexes = changeSchedules.reduce<number[]>(
      (acc, curr, index) => {
        if (ChangeStatusHelper.canExport(curr.status)) {
          acc.push(index);
        }
        return acc;
      },
      []
    );
  }

  private handleCheckboxChanges(): void {
    this.checkboxControl.valueChanges
      .pipe(
        tap((value: boolean[]) => {
          this.store.dispatch(
            teachingScheduleRequestChangeSelectExport({ selectExport: value })
          );
        })
      )
      .subscribe();
  }

  private calculateStickyColumn(): void {
    if (!this.isPersonal) {
      setTimeout(() => {
        this.teacherColumnWidth = (
          this.teacherColumn.nativeElement as HTMLElement
        ).offsetWidth;
        this.cdr.markForCheck();
      });
    }
  }
}
