import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule, TuiDataListModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiSelectModule } from '@taiga-ui/kit';
import { PermissionDirectiveModule } from '@teaching-scheduling-system/web/shared/directives/permission';
import { ChangeReportDialogModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-report-dialog';
import { ChangeRequestFilterLeftModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-request-filter-left';
import { ChangeRequestFilterComponent } from './change-request-filter.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiDataListModule,
  TuiSelectModule,
  TuiCheckboxLabeledModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PermissionDirectiveModule,
    ChangeReportDialogModule,
    ChangeRequestFilterLeftModule,
    ...NGRX,
    TAIGA_UI,
  ],
  declarations: [ChangeRequestFilterComponent],
  exports: [ChangeRequestFilterComponent],
})
export class ChangeRequestFilterModule {}
