import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiScrollbarModule } from '@taiga-ui/core';
import { ExamAssignStore } from '@teaching-scheduling-system/web/exam/data-access';
import { AssignFilterModule } from '@teaching-scheduling-system/web/exam/ui/assign-filter';
import { AssignListModule } from '@teaching-scheduling-system/web/exam/ui/assign-list';
import { AssignComponent } from './assign.component';

const TAIGA_UI = [TuiScrollbarModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AssignComponent }]),
    AssignFilterModule,
    AssignListModule,
    ...TAIGA_UI,
  ],
  declarations: [AssignComponent],
  providers: [ExamAssignStore],
})
export class AssignModule {}
