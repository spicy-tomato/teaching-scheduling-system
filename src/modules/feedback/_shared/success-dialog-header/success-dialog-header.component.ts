import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tuiIconCheckCircleLarge } from '@taiga-ui/icons';

@Component({
  selector: 'tss-success-dialog-header',
  templateUrl: './success-dialog-header.component.html',
  styleUrls: ['./success-dialog-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessDialogHeaderComponent {
  /** PUBLIC PROPERTIES */
  public readonly icon = tuiIconCheckCircleLarge;
}
