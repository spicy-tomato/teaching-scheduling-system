import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  EventSettingsModel,
  MonthService,
  WeekService,
} from '@syncfusion/ej2-angular-schedule';
import { loadCldr, setCulture, L10n } from '@syncfusion/ej2-base';
import { default as EJ2_LOCALE } from '@syncfusion/ej2-locale/src/vi.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load({ vi: EJ2_LOCALE.vi });
setCulture('vi');

@Component({
  selector: 'tss-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [WeekService, MonthService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnChanges {
  /** INPUT */
  @Input() public data!: Record<string, unknown>[];

  /** PUBLIC PROPERTIES */
  public eventSettings: EventSettingsModel = {};

  /** LIFE CYCLE */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.eventSettings = {
        dataSource: this.data,
      };
    }
  }
}
