import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { FixedScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  templateUrl: './change-schedule-history.component.html',
  styleUrls: ['./change-schedule-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeScheduleHistoryComponent {
  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<void, FixedScheduleModel[]>
  ) {}
}
