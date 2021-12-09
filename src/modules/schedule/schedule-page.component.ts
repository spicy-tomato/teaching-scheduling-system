import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EjsScheduleModel } from '@models/schedule/ejs-schedule.model';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import * as fromSchedule from './state';

@Component({
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent extends BaseComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public dataSource: EjsScheduleModel[] = [];

  /** CONSTRUCTOR */
  constructor(private store: Store<fromSchedule.ScheduleState>) {
    super();
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.store.dispatch(fromSchedule.load());
  }
}
