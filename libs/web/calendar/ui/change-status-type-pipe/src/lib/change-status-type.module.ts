import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeStatusTypePipe } from './change-status-type.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ChangeStatusTypePipe],
  exports: [ChangeStatusTypePipe],
})
export class ChangeStatusTypePipeModule {}
