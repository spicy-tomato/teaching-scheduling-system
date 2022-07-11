import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import {
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiSelectModule } from '@taiga-ui/kit';
import { PermissionDirectiveModule } from '@teaching-scheduling-system/web/shared/directives/permission';
import { ChangeRequestFilterLeftComponent } from './change-request-filter-left.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiCheckboxLabeledModule,
  TuiDataListModule,
  TuiSelectModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PermissionDirectiveModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangeRequestFilterLeftComponent],
  exports: [ChangeRequestFilterLeftComponent],
})
export class ChangeRequestFilterLeftModule {}
