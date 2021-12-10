import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingComponent } from './user-setting.component';
import { UserSettingRoutingModule } from './user-setting.routes';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, UserSettingRoutingModule],
  declarations: [UserSettingComponent],
})
export class UserSettingModule {}
