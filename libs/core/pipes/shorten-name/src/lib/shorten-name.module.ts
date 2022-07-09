import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortenNamePipe } from './shorten-name.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ShortenNamePipe],
  exports: [ShortenNamePipe],
})
export class ShortenNamePipeModule {}
