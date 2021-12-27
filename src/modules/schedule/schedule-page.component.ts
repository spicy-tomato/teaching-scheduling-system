import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import * as fromSchedule from './state';

@Component({
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent extends BaseComponent implements OnInit {
  /** CONSTRUCTOR */
  constructor(private store: Store<fromSchedule.ScheduleState>) {
    super();
    this.store.dispatch(fromSchedule.reset());
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.store.dispatch(fromSchedule.load({ departmentSchedule: false }));
  }
}
