import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulerComponent {
  public data: Record<string, unknown>[] = [
    {
      Id: 1,
      Subject: 'Meeting',
      StartTime: new Date(),
      EndTime: new Date(),
    },
    {
      Id: 2,
      Subject: 'Meeting',
      StartTime: new Date(2021, 11, 15),
      EndTime: new Date(2021, 11, 15),
    },
    {
      Id: 3,
      Subject: 'Meeting',
      StartTime: new Date(2021, 11, 15),
      EndTime: new Date(2021, 11, 15),
    },
    {
      Id: 4,
      Subject: 'Meeting',
      StartTime: new Date(2021, 11, 15),
      EndTime: new Date(2021, 11, 15),
    },
    {
      Id: 5,
      Subject: 'Meeting',
      StartTime: new Date(2021, 11, 15),
      EndTime: new Date(2021, 11, 15),
    },
    {
      Id: 5,
      Subject: 'Meeting',
      StartTime: new Date(2021, 11, 15, 7),
      EndTime: new Date(2021, 11, 15, 9, 30),
    },
  ];
}
