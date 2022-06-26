import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { TeachingDialogNavigationComponent } from './teaching-dialog-navigation.component';

const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [CommonModule, ...TAIGA_UI],
  declarations: [TeachingDialogNavigationComponent],
  exports: [TeachingDialogNavigationComponent],
})
export class TeachingDialogNavigationModule {}
