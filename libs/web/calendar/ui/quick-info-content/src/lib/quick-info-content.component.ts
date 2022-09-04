import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Inject,
  Input,
} from '@angular/core';
import { ScheduleComponent } from '@syncfusion/ej2-angular-schedule';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { EjsScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';

@Component({
  selector: 'tss-quick-info-content',
  templateUrl: './quick-info-content.component.html',
  styleUrls: ['./quick-info-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      size: 's',
    }),
  ],
})
export class QuickInfoContentComponent {
  // INPUT
  @Input() data!: EjsScheduleModel;

  // PUBLIC PROPERTIES
  newEventTitle = '';

  // CONSTRUCTOR
  constructor(
    @Inject(forwardRef(() => ScheduleComponent))
    readonly schedule: ScheduleComponent
  ) {}
}
