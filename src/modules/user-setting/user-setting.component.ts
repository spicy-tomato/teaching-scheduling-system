import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tss-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingComponent {}
