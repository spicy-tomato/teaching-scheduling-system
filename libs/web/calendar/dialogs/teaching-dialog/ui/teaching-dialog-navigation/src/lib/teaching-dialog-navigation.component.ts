import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TUI_BUTTON_OPTIONS, TuiAppearance } from '@taiga-ui/core';
import { EjsScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';

@Component({
  selector: 'tss-teaching-dialog-navigation',
  templateUrl: './teaching-dialog-navigation.component.html',
  styleUrls: ['./teaching-dialog-navigation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Flat,
        size: 'm',
      },
    },
  ],
})
export class TeachingDialogNavigationComponent {
  /** INPUT */
  @Input() public schedules!: EjsScheduleModel[];
  @Input() public selectedSchedule!: EjsScheduleModel;

  /** OUTPUT */
  @Output() public changeSelectedSchedule = new EventEmitter<number>();
}
