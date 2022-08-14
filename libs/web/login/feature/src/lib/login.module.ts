import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
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
import { LoginComponent } from './login.component';

const NGRX = [ReactiveComponentModule];
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
