import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { AssignTableModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-table';
import { AssignListComponent } from './assign-list.component';

const NGRX = [ReactiveComponentModule];

@NgModule({
  imports: [CommonModule, AssignTableModule, ...NGRX],
  declarations: [AssignListComponent],
  exports: [AssignListComponent],
})
export class AssignListModule {}
