import { ChangeDetectionStrategy } from '@angular/core';
import { Inject } from '@angular/core';
import { Component } from '@angular/core';
import { FixedScheduleModel } from '@shared/models';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  templateUrl: './study-history-dialog.component.html',
  styleUrls: ['./study-history-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyHistoryDialogComponent {
  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<void, FixedScheduleModel[]>
  ) {}
}
