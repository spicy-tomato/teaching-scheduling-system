import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiActiveZoneDirective, TuiDestroyService } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  calendarChangeSelectingState,
  calendarFilter,
  calendarSelectFilter,
  calendarSelectModules,
  calendarSelectTeachers,
  CalendarState,
} from '@teaching-scheduling-system/web/calendar/data-access';
import {
  CalendarFilter,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { combineLatest, Observable, Subject, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'tss-calendar-filter',
  templateUrl: './calendar-filter.component.html',
  styleUrls: ['./calendar-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiButtonOptionsProvider({
      appearance: 'flat',
      size: 'xs',
    }),
  ],
})
export class CalendarFilterComponent {
  /** INPUT */
  @Input() public activeZone!: TuiActiveZoneDirective;
  @Input() public forMenu = false;

  /** OUTPUT */
  @Output() public readonly filter = new EventEmitter<void>();

  /** PUBLIC PROPERTIES */
  public readonly PermissionConstant = PermissionConstant;
  public readonly filter$: Observable<CalendarFilter>;
  public readonly teachers$: Observable<SimpleModel[]>;
  public readonly modules$: Observable<string[]>;

  public showDepartmentSchedule = false;
  public filteredTeachers: SimpleModel[] = [];
  public filteredModules: string[] = [];

  /** PRIVATE PROPERTIES */
  private readonly reset$ = new Subject<void>();

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<CalendarState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.filter$ = store
      .select(calendarSelectFilter)
      .pipe(takeUntil(this.destroy$));
    this.teachers$ = store
      .select(calendarSelectTeachers)
      .pipe(takeUntil(this.destroy$));
    this.modules$ = store
      .select(calendarSelectModules)
      .pipe(takeUntil(this.destroy$));

    this.bindForm();
    this.handleReset();
  }

  /** PUBLIC METHODS */
  public onSelectingDepartmentChange(showDepartmentSchedule: boolean): void {
    this.store.dispatch(
      calendarChangeSelectingState({ changes: { showDepartmentSchedule } })
    );
    this.filteredModules = [];
  }

  public onSelectingTeachersChange(teachers: SimpleModel[]): void {
    this.store.dispatch(
      calendarChangeSelectingState({ changes: { teachers } })
    );
    this.filteredModules = [];
  }

  public onFilter(): void {
    this.store.dispatch(
      calendarFilter({
        filter: {
          showDepartmentSchedule: this.showDepartmentSchedule,
          teachers: this.filteredTeachers,
          modules: this.filteredModules,
        },
      })
    );
    this.filter.emit();
  }

  public reset(): void {
    this.reset$.next();
  }

  /** PRIVATE METHODS */
  private bindForm(): void {
    this.filter$
      .pipe(
        tap((filter) => {
          this.showDepartmentSchedule = filter.showDepartmentSchedule;
          this.filteredTeachers = filter.teachers;
          this.filteredModules = filter.modules;
        }),
        take(1)
      )
      .subscribe();
  }

  private handleReset(): void {
    combineLatest([this.filter$, this.reset$])
      .pipe(
        tap(([filter]) => this.resetFilter(filter)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public resetFilter(filter: CalendarFilter): void {
    this.showDepartmentSchedule = filter.showDepartmentSchedule;
    this.filteredTeachers = filter.teachers;
    this.filteredModules = filter.modules;
  }
}
