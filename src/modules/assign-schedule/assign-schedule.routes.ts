import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignScheduleComponent } from './assign-schedule.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Phân giảng',
    },
    component: AssignScheduleComponent,
    children: [
      {
        path: 'import',
        loadChildren: async () =>
          (
            await import(
              '@modules/assign-schedule/assign-schedule-import/assign-schedule-import.module'
            )
          ).AssignScheduleImportModule,
      },
      {
        path: '',
        loadChildren: async () =>
          (
            await import(
              '@modules/assign-schedule/assign-schedule-result/assign-schedule-result.module'
            )
          ).AssignScheduleResultModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignScheduleRoutingModule {}
