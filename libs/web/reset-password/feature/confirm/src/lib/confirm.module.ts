import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule, TuiErrorModule, TuiLinkModule } from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputPasswordModule,
  TuiIslandModule,
} from '@taiga-ui/kit';
import { SuccessDialogModule } from '@teaching-scheduling-system/web/reset-password/ui/success-dialog';
import { SuccessDialogHeaderModule } from '@teaching-scheduling-system/web/shared/ui/components/success-dialog-header';
import { NavbarModule } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { ConfirmComponent } from './confirm.component';
import { ConfirmStore } from './store';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiErrorModule,
  TuiFieldErrorPipeModule,
  TuiInputPasswordModule,
  TuiIslandModule,
  TuiLinkModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ConfirmComponent }]),
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NavbarModule,
    SuccessDialogHeaderModule,
    SuccessDialogModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ConfirmComponent],
  providers: [ConfirmStore],
})
export class ConfirmModule {}
