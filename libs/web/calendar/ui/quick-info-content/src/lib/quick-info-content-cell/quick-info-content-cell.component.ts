import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EjsScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';

@Component({
  selector: 'tss-quick-info-content-cell',
  templateUrl: './quick-info-content-cell.component.html',
  styleUrls: ['./quick-info-content-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickInfoContentCellComponent {
  // INPUT
  @Input() data!: EjsScheduleModel;

  // PUBLIC PROPERTIES
  newEventTitle = '';
  
  // PUBLIC METHODS
  onShowMoreDetails(): void {
    // TODO (Add event)
  }

  onSave(): void {
    // TODO (Add event)
  }
}
