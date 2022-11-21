import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionComponent } from './version.component';

@NgModule({
  imports: [CommonModule],
  declarations: [VersionComponent],
  exports: [VersionComponent],
})
export class VersionModule {}
