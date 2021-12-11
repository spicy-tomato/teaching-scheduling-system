import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password.routes';
import { TuiInputPasswordModule, TuiIslandModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiHintControllerModule,
  TuiHintModule,
  TuiNotificationsModule,
} from '@taiga-ui/core';
import { TuiValidatorModule } from '@taiga-ui/cdk';
import * as fromChangePassword from './state';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromChangePassword.changePasswordFeatureKey,
    fromChangePassword.changePasswordReducer
  ),
  EffectsModule.forFeature([fromChangePassword.ChangePasswordEffects]),
];
const TAIGA_UI = [
  TuiIslandModule,
  TuiInputPasswordModule,
  TuiValidatorModule,
  TuiHintModule,
  TuiHintControllerModule,
  TuiButtonModule,
  TuiNotificationsModule,
  TuiErrorModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChangePasswordRoutingModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
