import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { ChangeSchedule } from '@teaching-scheduling-system/web/shared/data-access/models';
import { ScheduleConstant } from '@teaching-scheduling-system/web/shared/utils/constants';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  templateUrl: './change-details-dialog.component.html',
  styleUrls: ['./change-details-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeDetailsDialogComponent {
  /** PUBLIC PROPERTIES */
  public readonly statusList = ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS;

  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<void, ChangeSchedule>
  ) {}
}
