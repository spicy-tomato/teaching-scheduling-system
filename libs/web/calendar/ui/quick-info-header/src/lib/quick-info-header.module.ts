import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickInfoHeaderComponent } from './quick-info-header.component';
import { TuiButtonModule } from '@taiga-ui/core';

const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [CommonModule, ...TAIGA_UI],
  declarations: [QuickInfoHeaderComponent],
  exports: [QuickInfoHeaderComponent],
})
export class QuickInfoHeaderModule {}
