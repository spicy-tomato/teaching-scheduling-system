import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiMultiSelectModule,
  TuiRadioLabeledModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { PermissionDirectiveModule } from '@teaching-scheduling-system/web/shared/directives/permission';
import { CalendarFilterComponent } from './calendar-filter.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiActiveZoneModule,
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiMultiSelectModule,
  TuiRadioLabeledModule,
  TuiSelectModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    VarDirectiveModule,
    PermissionDirectiveModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [CalendarFilterComponent],
  exports: [CalendarFilterComponent],
})
export class CalendarFilterModule {}
