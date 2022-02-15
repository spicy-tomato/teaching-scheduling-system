import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { TuiButtonModule } from '@taiga-ui/core';

const TAIGA_UI = [PolymorpheusModule, TuiButtonModule];

@NgModule({
  imports: [CommonModule, ...TAIGA_UI],
  declarations: [ConfirmDialogComponent],
})
export class ConfirmModule {}
