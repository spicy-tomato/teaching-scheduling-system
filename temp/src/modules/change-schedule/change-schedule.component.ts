import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PermissionConstant } from '@shared/constants';

@Component({
  templateUrl: './change-schedule.component.html',
  styleUrls: ['./change-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeScheduleComponent {
  public readonly permissionConstant = PermissionConstant;
}
