import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignRightTitleComponent } from './assign-right-title.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [CommonModule, ...NGRX, TAIGA_UI],
  declarations: [AssignRightTitleComponent],
  exports: [AssignRightTitleComponent],
})
export class AssignRightTitleModule {}
