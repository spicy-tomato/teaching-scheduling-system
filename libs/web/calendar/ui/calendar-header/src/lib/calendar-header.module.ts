import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCalendarMonthModule,
  TuiMultiSelectModule,
  TuiRadioLabeledModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { PermissionDirectiveModule } from '@teaching-scheduling-system/web/shared/directives/permission';
import { CalendarHeaderComponent } from './calendar-header.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiLoaderModule,
  TuiHostedDropdownModule,
  TuiCalendarMonthModule,
  TuiRadioLabeledModule,
  TuiExpandModule,
  TuiSelectModule,
  TuiMultiSelectModule,
  TuiDataListModule,
  TuiActiveZoneModule,
  TuiButtonModule,
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
  declarations: [CalendarHeaderComponent],
  exports: [CalendarHeaderComponent],
})
export class CalendarHeaderModule {}
