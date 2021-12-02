import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routes';
import {
  TuiCheckboxLabeledModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiHintControllerModule,
  TuiHintModule,
  TuiLinkModule,
} from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import * as fromLogin from './state';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(fromLogin.loginFeatureKey, fromLogin.loginReducer),
  EffectsModule.forFeature([fromLogin.LoginEffects]),
];
const TAIGA_UI = [
  TuiInputPasswordModule,
  TuiInputModule,
  TuiButtonModule,
  TuiCheckboxLabeledModule,
  TuiLinkModule,
  TuiHintControllerModule,
  TuiHintModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
