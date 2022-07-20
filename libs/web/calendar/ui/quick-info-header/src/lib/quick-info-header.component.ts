import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EjsScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';

@Component({
  selector: 'tss-quick-info-header',
  templateUrl: './quick-info-header.component.html',
  styleUrls: ['./quick-info-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickInfoHeaderComponent {
  /** INPUT */
  @Input() public data!: EjsScheduleModel;

  /** OUTPUT */
  @Output() public showEditorDialog = new EventEmitter<void>();
  @Output() public closeDialog = new EventEmitter<void>();
}
