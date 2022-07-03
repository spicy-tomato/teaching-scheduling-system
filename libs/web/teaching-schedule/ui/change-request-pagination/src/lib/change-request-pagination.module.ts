import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { ChangeRequestPaginationComponent } from './change-request-pagination.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiPaginationModule];

@NgModule({
  imports: [CommonModule, ...NGRX, ...TAIGA_UI],
  declarations: [ChangeRequestPaginationComponent],
  exports: [ChangeRequestPaginationComponent],
})
export class ChangeRequestPaginationModule {}
