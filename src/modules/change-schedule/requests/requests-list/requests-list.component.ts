import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { PermissionConstant, TableConstant } from '@shared/constants';
import { EApiStatus } from '@shared/enums';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleStatus,
  Nullable,
} from '@shared/models';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import * as fromRequests from '../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ChangeStatusHelper } from '@shared/helpers';

@Component({
  selector: 'tss-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsListComponent extends BaseComponent {
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

  public readonly EApiStatus = EApiStatus;
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
    private readonly store: Store<fromRequests.RequestsState>,
    appShellStore: Store<fromAppShell.AppShellState>,
    route: ActivatedRoute
  ) {
    super();

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
    this.changeSchedules$ = store
      .select(fromRequests.selectChangeSchedules)
      .pipe(takeUntil(this.destroy$));
    this.status$ = store
      .select(fromRequests.selectStatus)
      .pipe(takeUntil(this.destroy$));
    this.page$ = store
      .select(fromRequests.selectPage)
      .pipe(takeUntil(this.destroy$));
    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
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
            fromRequests.changeSelectExport({ selectExport: value })
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
