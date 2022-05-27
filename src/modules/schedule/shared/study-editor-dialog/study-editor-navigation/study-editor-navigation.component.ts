import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {  EjsScheduleModel } from '@shared/models';
import { TuiAppearance, TUI_BUTTON_OPTIONS } from '@taiga-ui/core';

@Component({
  selector: 'tss-study-editor-navigation',
  templateUrl: './study-editor-navigation.component.html',
  styleUrls: ['./study-editor-navigation.component.scss'],
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
export class StudyEditorNavigationComponent {
  /** INPUT */
  @Input() public schedules!: EjsScheduleModel[];
  @Input() public selectedSchedule!: EjsScheduleModel;

  /** OUTPUT */
  @Output() public changeSelectedSchedule = new EventEmitter<number>();
}
