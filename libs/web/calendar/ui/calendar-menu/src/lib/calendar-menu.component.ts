import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule';
import {
  TuiContextWithImplicit,
  TuiDestroyService,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import {
  calendarChangeView,
  calendarSelectView,
  CalendarState,
} from '@teaching-scheduling-system/web/calendar/data-access';
import { Observable, takeUntil } from 'rxjs';

type ViewItem = {
  id: View;
  name: string;
};

@Component({
  selector: 'tss-calendar-menu',
  templateUrl: './calendar-menu.component.html',
  styleUrls: ['./calendar-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiButtonOptionsProvider({
      appearance: 'icon',
      size: 'm',
    }),
  ],
})
export class CalendarMenuComponent {
  /** INPUT */
  @Input() scheduleComponent!: ScheduleComponent;

  /** PUBLIC PROPERTIES */
  readonly view$: Observable<View>;
  readonly viewList: ViewItem[] = [
    { id: 'Month', name: 'Tháng' },
    { id: 'Week', name: 'Tuần' },
    { id: 'Day', name: 'Ngày' },
  ];
  openRightMenu = false;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<CalendarState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.view$ = store
      .select(calendarSelectView)
      .pipe(takeUntil(this.destroy$));
  }

  /** PUBLIC METHODS */
  @tuiPure
  stringifyView(): TuiStringHandler<TuiContextWithImplicit<View>> {
    const map = new Map(
      this.viewList.map(({ id, name }) => [id, name] as [View, string])
    );

    return ({ $implicit }) => map.get($implicit) || '';
  }

  toggleRightMenu(open: boolean): void {
    this.openRightMenu = open;
  }

  onSelectView(view: View): void {
    this.store.dispatch(calendarChangeView({ view }));
  }

  onFilter(): void {
    this.openRightMenu = false;
  }
}
