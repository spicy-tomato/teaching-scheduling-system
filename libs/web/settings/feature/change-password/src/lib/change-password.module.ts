import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputPasswordModule,
  TuiIslandModule,
} from '@taiga-ui/kit';
import { SettingsChangePasswordStore } from '@teaching-scheduling-system/web/settings/data-access';
import { ChangePasswordComponent } from './change-password.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiIslandModule,
  TuiInputPasswordModule,
  TuiErrorModule,
  TuiFieldErrorPipeModule,
  TuiButtonModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ChangePasswordComponent }]),
    ReactiveFormsModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangePasswordComponent],
  providers: [SettingsChangePasswordStore],
})
export class ChangePasswordModule {}
