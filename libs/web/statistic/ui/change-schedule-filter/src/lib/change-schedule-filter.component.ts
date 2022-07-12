import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  RANGE_SEPARATOR_CHAR,
  TuiDay,
  TuiDayRange,
  TuiDestroyService
} from '@taiga-ui/cdk';
import { IconConstant, InputDateRangeConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectNotNullTeacher
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { NavbarService } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { StatisticChangeScheduleStore } from '@teaching-scheduling-system/web/statistic/data-access';
import { Observable, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'tss-change-schedule-filter',
  templateUrl: './change-schedule-filter.component.html',
  styleUrls: ['./change-schedule-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    {
      provide: RANGE_SEPARATOR_CHAR,
      useValue: ',',
    },
  ],
})
export class ChangeScheduleFilterComponent implements OnInit, AfterViewInit {
  /** VIEWCHILD */
  @ViewChild('export') public exportTemplate!: TemplateRef<never>;

  /** PUBLIC PROPERTIES */
  public form!: FormGroup;

  public readonly IconConstant = IconConstant;
  public readonly EApiStatus = EApiStatus;
  public readonly items = InputDateRangeConstant.getPeriods();
  public readonly min = new TuiDay(2021, 10, 1);
  public readonly status$: Observable<EApiStatus>;

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Teacher>;

  /** GETTERS */
  private get rangeControlValue(): TuiDayRange {
    return this.form.controls['range'].value as TuiDayRange;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly navbarService: NavbarService,
    private readonly store: StatisticChangeScheduleStore,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.status$ = store.status$;
    this.teacher$ = appShellStore.pipe(
      selectNotNullTeacher,
      takeUntil(this.destroy$)
    );

    this.initForm();
  }

  /** LIFECYCLE */
  public ngOnInit(): void {
    this.statisticizeFirstTime();
  }

  public ngAfterViewInit(): void {
    this.navbarService.addRightMenu(this.exportTemplate);
  }

  /** PUBLIC METHODS */
  public statisticize(): void {
    const range = this.rangeControlValue;
    if (range) {
      this.store.statisticize({ range });
    }
  }

  /** PRIVATE METHODS */
  private statisticizeFirstTime(): void {
    this.teacher$
      .pipe(
        ObservableHelper.filterNullish(),
        tap(() => this.statisticize()),
        take(1)
      )
      .subscribe();
  }

  private initForm(): void {
    this.form = this.fb.group({
      range: [this.items[1].range, Validators.required],
    });
  }
}
