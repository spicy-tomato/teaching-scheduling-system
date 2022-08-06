import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RANGE_SEPARATOR_CHAR, TuiDayRange } from '@taiga-ui/cdk';
import {
  IconConstant,
  InputDateRangeConstant,
} from '@teaching-scheduling-system/core/data-access/constants';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { NavbarService } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { StatisticChangeScheduleStore } from '@teaching-scheduling-system/web/statistic/data-access';
import { take, tap } from 'rxjs';

@Component({
  selector: 'tss-change-schedule-filter',
  templateUrl: './change-schedule-filter.component.html',
  styleUrls: ['./change-schedule-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: RANGE_SEPARATOR_CHAR,
      useValue: ',',
    },
  ],
})
export class ChangeScheduleFilterComponent implements OnInit, AfterViewInit {
  /** VIEWCHILD */
  @ViewChild('export') exportTemplate!: TemplateRef<never>;

  /** PUBLIC PROPERTIES */
  form!: FormGroup;

  readonly IconConstant = IconConstant;
  readonly status$ = this.store.status$;

  /** PRIVATE PROPERTIES */
  private readonly teacher$ = this.store.teacher$;

  /** GETTERS */
  private get rangeControlValue(): TuiDayRange {
    return this.form.controls['range'].value as TuiDayRange;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly navbarService: NavbarService,
    private readonly store: StatisticChangeScheduleStore
  ) {
    this.initForm();
  }

  /** LIFECYCLE */
  ngOnInit(): void {
    this.statisticizeFirstTime();
  }

  ngAfterViewInit(): void {
    this.navbarService.addRightMenu(this.exportTemplate);
  }

  /** PUBLIC METHODS */
  statisticize(): void {
    const range = this.rangeControlValue;
    if (range) {
      this.store.statisticize({ range });
    }
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      range: [
        InputDateRangeConstant.getPreviousMonthRange(),
        Validators.required,
      ],
    });
  }

  private statisticizeFirstTime(): void {
    this.teacher$
      .pipe(
        ObservableHelper.filterNullish(),
        tap(() => this.statisticize()),
        take(1)
      )
      .subscribe();
  }
}
