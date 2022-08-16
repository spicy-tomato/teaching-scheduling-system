import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiComboBoxModule, TuiDataListWrapperModule } from '@taiga-ui/kit';
import { FilterByInputPipeModule } from '@teaching-scheduling-system/core/pipes/filter-by-input-pipe';
import { ChangeSetRoomDialogComponent } from './change-set-room-dialog.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiComboBoxModule, TuiDataListWrapperModule, TuiButtonModule];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FilterByInputPipeModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangeSetRoomDialogComponent],
  exports: [ChangeSetRoomDialogComponent],
})
export class ChangeSetRoomDialogModule {}
