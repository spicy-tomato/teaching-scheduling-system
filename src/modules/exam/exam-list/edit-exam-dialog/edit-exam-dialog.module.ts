import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditExamDialogComponent } from './edit-exam-dialog.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiComboBoxModule, TuiDataListWrapperModule } from '@taiga-ui/kit';
import { PipesModule } from '@pipes/pipes.module';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiButtonModule, TuiDataListWrapperModule, TuiComboBoxModule];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PipesModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [EditExamDialogComponent],
  exports: [EditExamDialogComponent],
})
export class EditExamDialogModule {}
