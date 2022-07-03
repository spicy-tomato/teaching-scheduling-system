import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './change-schedule.component.html',
  styleUrls: ['./change-schedule.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeScheduleComponent {}
