import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { View } from '@syncfusion/ej2-angular-schedule';
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
  /** OUTPUT */
  @Output() public readonly clickToday = new EventEmitter<void>();

  /** PUBLIC PROPERTIES */
  public readonly view$: Observable<View>;
  public readonly viewList: ViewItem[] = [
    { id: 'Month', name: 'Tháng' },
    { id: 'Week', name: 'Tuần' },
    { id: 'Day', name: 'Ngày' },
  ];
  public openRightMenu = false;

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
  public stringifyView(): TuiStringHandler<TuiContextWithImplicit<View>> {
    const map = new Map(
      this.viewList.map(({ id, name }) => [id, name] as [View, string])
    );

    return ({ $implicit }: TuiContextWithImplicit<View>) =>
      map.get($implicit) || '';
  }

  public toggleRightMenu(open: boolean): void {
    this.openRightMenu = open;
  }

  public onSelectView(view: View): void {
    this.store.dispatch(calendarChangeView({ view }));
  }

  public onFilter(): void {
    this.openRightMenu = false;
  }
}
