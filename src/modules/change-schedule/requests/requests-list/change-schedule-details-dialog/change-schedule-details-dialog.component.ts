import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CoreConstant } from '@shared/constants';
import { ChangeSchedule } from '@shared/models';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'tss-change-schedule-details-dialog',
  templateUrl: './change-schedule-details-dialog.component.html',
  styleUrls: ['./change-schedule-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeScheduleDetailsDialogComponent {
  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<void, ChangeSchedule>
  ) {}

  /** PUBLIC PROPERTIES */
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
}
