import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { RequestStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';

@Component({
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequestStore],
})
export class ChangeComponent {
  // PUBLIC PROPERTIES
  readonly PermissionConstant = PermissionConstant;
}
