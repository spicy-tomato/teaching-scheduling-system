import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [ReactiveComponentModule];

@NgModule({
  imports: [CommonModule, ...NGRX],
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
})
export class LoaderModule {}
