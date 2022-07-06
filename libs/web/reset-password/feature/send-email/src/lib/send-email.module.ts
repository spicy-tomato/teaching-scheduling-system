import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLinkModule,
  TuiNotificationModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiIslandModule,
} from '@taiga-ui/kit';
import { NavbarModule } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { SendEmailComponent } from './send-email.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiErrorModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiIslandModule,
  TuiLinkModule,
  TuiNotificationModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SendEmailComponent }]),
    ReactiveFormsModule,
    NavbarModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [SendEmailComponent],
})
export class SendEmailModule {}
