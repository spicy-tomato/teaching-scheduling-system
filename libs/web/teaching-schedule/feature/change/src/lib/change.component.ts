import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';

@Component({
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeComponent {
  /** PUBLIC PROPERTIES */
  readonly PermissionConstant = PermissionConstant;
}
