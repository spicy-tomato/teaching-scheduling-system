import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AgendaService,
  EventRenderedArgs,
  EventSettingsModel,
  MonthService,
  PopupOpenEventArgs,
  WeekService,
} from '@syncfusion/ej2-angular-schedule';

import { loadCldr, setCulture, L10n } from '@syncfusion/ej2-base';
import { default as EJ2_LOCALE } from '@syncfusion/ej2-locale/src/vi.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import * as fromSchedule from '../state';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load({ vi: EJ2_LOCALE.vi });
setCulture('vi');

@Component({
  selector: 'tss-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [WeekService, MonthService, AgendaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TssScheduleComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public eventSettings$ = new BehaviorSubject<EventSettingsModel>({});

  /** PRIVATE PROPERTIES */
  private readonly staticSettings: EventSettingsModel = {
    allowAdding: false,
    allowEditing: true,
    allowDeleting: false,
  };

  /** CONSTRUCTOR */
  constructor(private store: Store<fromSchedule.ScheduleState>) {
    super();

    this.handleLoadSchedule();
  }

  /** PUBLIC METHODS */
  public onEventRendered(args: EventRenderedArgs): void {
    switch (args.data.Type) {
      case 'exam':
        args.element.style.backgroundColor = '#ff8c67';
        break;
    }
  }

  public onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      const statusElement: HTMLInputElement = args.element.querySelector(
        '#EventType'
      ) as HTMLInputElement;
      const startElement: HTMLInputElement = args.element.querySelector(
        '#StartTime'
      ) as HTMLInputElement;
      if (!startElement.classList.contains('e-datetimepicker')) {
      //   new DateTimePicker(
      //     { value: new Date(startElement.value) || new Date() },
      //     startElement
      //   );
      // }
      // let endElement: HTMLInputElement = args.element.querySelector(
      //   '#EndTime'
      // ) as HTMLInputElement;
      // if (!endElement.classList.contains('e-datetimepicker')) {
      //   new DateTimePicker(
      //     { value: new Date(endElement.value) || new Date() },
      //     endElement
      //   );
      // }
      }
    }
  }

  /** PRIVATE METHODS */
  private handleLoadSchedule(): void {
    this.store
      .select(fromSchedule.selectSchedule)
      .pipe(
        tap((schedules) => {
          const dataSource = schedules.map((x) => x.toEjsSchedule());
          this.eventSettings$.next({ dataSource, ...this.staticSettings });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
