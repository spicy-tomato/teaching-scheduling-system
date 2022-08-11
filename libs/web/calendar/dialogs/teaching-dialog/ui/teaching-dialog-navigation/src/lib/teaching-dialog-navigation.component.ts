import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { EjsScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';

@Component({
  selector: 'tss-teaching-dialog-navigation',
  templateUrl: './teaching-dialog-navigation.component.html',
  styleUrls: ['./teaching-dialog-navigation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'flat',
      size: 'm',
    }),
  ],
})
export class TeachingDialogNavigationComponent {
  // INPUT
  @Input() schedules!: EjsScheduleModel[];
  @Input() selectedSchedule!: EjsScheduleModel;

  // OUTPUT
  @Output() changeSelectedSchedule = new EventEmitter<number>();
}
