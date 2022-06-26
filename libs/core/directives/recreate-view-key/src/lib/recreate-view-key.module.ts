import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecreateViewKeyDirective } from './recreate-view-key.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [RecreateViewKeyDirective],
  exports: [RecreateViewKeyDirective],
})
export class RecreateViewKeyDirectiveModule {}
