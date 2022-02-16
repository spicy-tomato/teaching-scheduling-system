import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingComponent } from './user-setting.component';
import { UserSettingRoutingModule } from './user-setting.routes';
import { RouterModule } from '@angular/router';
import { TuiActionModule } from '@taiga-ui/kit';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiLoaderModule } from '@taiga-ui/core';

const NGRX = [ReactiveComponentModule];

const TAIGA_UI = [TuiActionModule, TuiLoaderModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UserSettingRoutingModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [UserSettingComponent],
})
export class UserSettingModule {}
