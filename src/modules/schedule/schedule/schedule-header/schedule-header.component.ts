import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TuiMonth } from '@taiga-ui/cdk';
import { TuiAppearance, TUI_BUTTON_OPTIONS } from '@taiga-ui/core';
import { combineLatest, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { delay, map, takeUntil } from 'rxjs/operators';
import { PermissionConstant } from '@constants/core/permission.constant';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule';
import { DateHelper } from 'src/shared/helpers/date.helper';
import * as fromAppShell from '@modules/core/components/app-shell/state';
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
export class ScheduleHeaderComponent
  extends BaseComponent
  implements AfterViewInit
{
  /** INPUT */
  @Input() public scheduleComponent!: ScheduleComponent;

  /** OUTPUT */
  @Output() public clickToday = new EventEmitter<void>();

  /** PUBLIC PROPERTIES */
  public view$!: Observable<View>;
  public permissions$!: Observable<number[] | undefined>;
  public openSelectMonth = false;
  public month$!: Observable<TuiMonth>;
  public dateRange!: string;
  public dateRange$!: Observable<string>;
  public filterForm!: FormGroup;
  public activateFilterButton$!: Observable<boolean>;
  public openFilter = false;
  public readonly permissionConstant = PermissionConstant;

  /** GETTERS */
  private get showDepartmentSchedule(): AbstractControl | null {
    return this.filterForm?.get('showDepartmentSchedule');
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
    this.handleChangeMonth();
    this.handleChangeView();
  }

  public ngAfterViewInit(): void {
    this.triggerDateRange();
  }

  /** PUBLIC METHODS */
  public onPrev(): void {
    this.store.dispatch(
      fromSchedule.prev({
        oldSelectedDate: this.scheduleComponent.selectedDate,
      })
    );
  }

  public onNext(): void {
    this.store.dispatch(
      fromSchedule.next({
        oldSelectedDate: this.scheduleComponent.selectedDate,
      })
    );
  }
  public onSelectMonth(month: TuiMonth): void {
    this.openSelectMonth = false;
    this.store.dispatch(fromSchedule.changeMonth({ month }));
  }

  public filter(): void {
    const departmentSchedule =
      (this.showDepartmentSchedule?.value as boolean) ?? false;
    this.store.dispatch(fromSchedule.load({ departmentSchedule }));
    this.openFilter = false;
  }

  public onClickMonth(): void {
    this.store.dispatch(fromSchedule.changeView({ view: 'Month' }));
  }

  public onClickWeek(): void {
    this.store.dispatch(fromSchedule.changeView({ view: 'Week' }));
  }

  public onClickDay(): void {
    this.store.dispatch(fromSchedule.changeView({ view: 'Day' }));
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.filterForm = this.fb.group({
      showDepartmentSchedule: [false],
    });
  }

  private handleChangeMonth(): void {
    this.month$ = this.store
      .select(fromSchedule.selectMonth)
      .pipe(takeUntil(this.destroy$));
  }

  private handleChangeView(): void {
    this.view$ = this.store
      .select(fromSchedule.selectView)
      .pipe(takeUntil(this.destroy$));
  }

  private triggerDateRange(): void {
    this.dateRange$ = combineLatest([
      this.store.select(fromSchedule.selectView),
      this.store.select(fromSchedule.selectSelectedDate),
    ]).pipe(
      map(([view]) => view),
      delay(0),
      map((view) => {
        switch (view) {
          case 'Month':
            return this.handleViewMonth();
          case 'Week':
            return this.handleViewWeek();
          case 'Day':
            return this.handleViewDay();
        }
        return '';
      }),
      takeUntil(this.destroy$)
    );
  }
  private handleViewMonth(): string {
    const date = this.scheduleComponent.selectedDate;
    return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  }

  private handleViewWeek(): string {
    const currentViewDates = this.scheduleComponent.getCurrentViewDates();
    const first = currentViewDates[0];
    const last = currentViewDates[6];

    if (first.getMonth() == last.getMonth()) {
      return `${DateHelper.beautifyDay(
        first.getDate()
      )} - ${DateHelper.beautifyDay(last.getDate())}
      Tháng ${first.getMonth() + 1}, ${first.getFullYear()}`;
    } else if (first.getFullYear() == last.getFullYear()) {
      return `${DateHelper.beautifyDay(first.getDate())} Tháng ${
        first.getMonth() + 1
      } -
      ${DateHelper.beautifyDay(last.getDate())} Tháng ${
        last.getMonth() + 1
      }, ${first.getFullYear()}`;
    } else {
      return `${DateHelper.beautifyDay(first.getDate())} Tháng ${
        first.getMonth() + 1
      }, ${first.getFullYear()} -
      ${DateHelper.beautifyDay(last.getDate())} Tháng ${
        last.getMonth() + 1
      }, ${last.getFullYear()}`;
    }
  }

  private handleViewDay(): string {
    const date = this.scheduleComponent.selectedDate;
    return `${date.getDate()} Tháng ${
      date.getMonth() + 1
    }, ${date.getFullYear()}`;
  }
}
