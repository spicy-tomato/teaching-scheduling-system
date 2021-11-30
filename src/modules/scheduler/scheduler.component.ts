import { Component } from '@angular/core';
import {
  EventSettingsModel,
  MonthService,
  WeekService,
} from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'tss-schedule',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [
    WeekService,
    MonthService,
  ],
})
export class ScheduleComponent {
  public data: object[] = [
    {
      Id: 1,
      Subject: 'Meeting',
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 15, 12, 30),
    },
  ];
  public eventSettings: EventSettingsModel = {
    dataSource: this.data,
    
  };
}
