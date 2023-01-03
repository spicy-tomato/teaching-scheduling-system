import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { QuickInfoHeaderComponent } from './quick-info-header.component';

const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [CommonModule, VarDirectiveModule, ...TAIGA_UI],
  declarations: [QuickInfoHeaderComponent],
  exports: [QuickInfoHeaderComponent],
})
export class QuickInfoHeaderModule {}
