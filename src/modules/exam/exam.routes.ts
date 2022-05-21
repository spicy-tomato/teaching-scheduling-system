import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Phân lịch thi',
    },
    component: ExamComponent,
    children: [
      // {
      //   path: 'import',
      //   loadChildren: async () =>
      //     (
      //       await import(
      //         '@modules/assign-schedule/assign-schedule-import/assign-schedule-import.module'
      //       )
      //     ).AssignScheduleImportModule,
      // },
      {
        path: '',
        loadChildren: async () =>
          (await import('@modules/exam/exam-list/exam-list.module'))
            .ExamListModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamRoutingModule {}
