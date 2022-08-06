import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  TuiActiveZoneDirective,
  TuiContextWithImplicit,
  TuiDestroyService,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  calendarChangeSelectingState,
  calendarFilter,
  calendarSelectCurrentFilter,
  calendarSelectModules,
  calendarSelectTeachers,
  CalendarState,
} from '@teaching-scheduling-system/web/calendar/data-access';
import {
  CalendarFilter,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable, takeUntil } from 'rxjs';

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
  // INPUT 
  @Input() activeZone!: TuiActiveZoneDirective;
  @Input() forMenu = false;

  // OUTPUT 
  @Output() readonly filter = new EventEmitter<void>();

  // PUBLIC PROPERTIES 
  readonly PermissionConstant = PermissionConstant;
  readonly filter$: Observable<CalendarFilter>;
  readonly teachers$: Observable<SimpleModel[]>;
  readonly modules$: Observable<string[]>;

  // CONSTRUCTOR 
  constructor(
    private readonly store: Store<CalendarState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.filter$ = store
      .select(calendarSelectCurrentFilter)
      .pipe(takeUntil(this.destroy$));
    this.teachers$ = store
      .select(calendarSelectTeachers)
      .pipe(takeUntil(this.destroy$));
    this.modules$ = store
      .select(calendarSelectModules)
      .pipe(takeUntil(this.destroy$));
  }

  // PUBLIC METHODS 
  @tuiPure
  stringifyTeacher(
    items: SimpleModel[]
  ): TuiStringHandler<TuiContextWithImplicit<string[]>> {
    const map = new Map(
      items.map(({ id, name }) => [id, name] as [string, string])
    );

    return ({ $implicit }) =>
      $implicit.length === 0
        ? 'Tất cả'
        : $implicit.length === 1
        ? map.get($implicit[0]) || ''
        : `${$implicit.length} giảng viên`;
  }

  onChangeSelectingState(changes: Partial<CalendarFilter>): void {
    this.store.dispatch(calendarChangeSelectingState({ changes }));
  }

  onFilter(): void {
    this.store.dispatch(calendarFilter());
    this.filter.emit();
  }
}
