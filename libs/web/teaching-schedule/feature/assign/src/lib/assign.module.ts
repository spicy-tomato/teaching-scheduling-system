import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssignStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { AssignFilterModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-filter';
import { AssignLeftTitleModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-left-title';
import { AssignListModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-list';
import { AssignResultModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-result';
import { AssignRightTitleModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-right-title';
import { AssignTableModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-table';
import { AssignComponent } from './assign.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AssignComponent }]),
    AssignFilterModule,
    AssignLeftTitleModule,
    AssignListModule,
    AssignResultModule,
    AssignRightTitleModule,
    AssignTableModule,
  ],
  declarations: [AssignComponent],
  providers: [AssignStore],
})
export class AssignModule {}
