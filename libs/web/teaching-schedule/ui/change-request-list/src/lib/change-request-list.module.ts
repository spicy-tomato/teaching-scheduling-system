import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { ArrayPipeModule } from '@teaching-scheduling-system/core/pipes/array';
import { ChangeDenyDialogModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-deny-dialog';
import { ChangeSetRoomDialogModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-set-room-dialog';
import { StatusColorPipeModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-status-color-pipe';
import { CanExportPipe } from './can-export-pipe/can-export.pipe';
import { ChangeRequestListActionComponent } from './change-request-list-action/change-request-list-action.component';
import { ChangeRequestListStatusComponent } from './change-request-list-status/change-request-list-status.component';
import { ChangeRequestListComponent } from './change-request-list.component';
import { StatusTypePipe } from './status-type-pipe/status-type.pipe';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiCheckboxModule,
  TuiHintModule,
  TuiLetModule,
  TuiLoaderModule,
  TuiTableModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VarDirectiveModule,
    ArrayPipeModule,
    ChangeDenyDialogModule,
    ChangeSetRoomDialogModule,
    StatusColorPipeModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    ChangeRequestListComponent,
    ChangeRequestListActionComponent,
    ChangeRequestListStatusComponent,
    StatusTypePipe,
    CanExportPipe,
  ],
  exports: [ChangeRequestListComponent],
})
export class ChangeRequestListModule {}
