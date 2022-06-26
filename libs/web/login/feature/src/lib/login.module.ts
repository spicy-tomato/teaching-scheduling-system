import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  TuiButtonModule,
  TuiHintControllerModule,
  TuiHintModule,
  TuiLinkModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import {
  LoginEffects,
  loginFeatureKey,
  loginReducer,
} from '@teaching-scheduling-system/web/login/data-access';
import { LoginComponent } from './login.component';

const NGRX = [
  StoreModule.forFeature(loginFeatureKey, loginReducer),
  EffectsModule.forFeature([LoginEffects]),
  ReactiveComponentModule,
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
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LoginComponent },
    ]),
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginModule {}
