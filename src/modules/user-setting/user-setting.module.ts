import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingComponent } from './user-setting.component';
import { UserSettingRoutingModule } from './user-setting.routes';
import { RouterModule } from '@angular/router';
import { TuiActionModule } from '@taiga-ui/kit';

const TAIGA_UI = [TuiActionModule];

@NgModule({
  imports: [CommonModule, RouterModule, UserSettingRoutingModule, ...TAIGA_UI],
  declarations: [UserSettingComponent],
})
export class UserSettingModule {}
