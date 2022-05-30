import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamListComponent } from './exam-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Phân lịch thi',
    },
    component: ExamListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamListRoutingModule {}
