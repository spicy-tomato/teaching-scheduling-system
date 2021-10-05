import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routes';
import { TuiCheckboxLabeledModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiHintControllerModule, TuiHintModule, TuiLinkModule } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import * as fromLogin from './state';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    TuiInputPasswordModule,
    TuiInputModule,
    TuiButtonModule,
    TuiCheckboxLabeledModule,
    TuiLinkModule,
    TuiHintControllerModule,
    TuiHintModule,
    StoreModule.forFeature(
      fromLogin.loginFeatureKey,
      fromLogin.loginReducer
    ),
    EffectsModule.forFeature([fromLogin.LoginEffects]),
  ],
  declarations: [LoginComponent],
})
export class LoginModule { }
