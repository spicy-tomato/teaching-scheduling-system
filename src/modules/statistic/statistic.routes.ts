import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Thống kê',
    },
    children: [
      {
        path: 'change-schedule',
        loadChildren: async () =>
          (
            await import(
              './statistic-change-schedule/statistic-change-schedule.module'
            )
          ).StatisticChangeScheduleModule,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'change-schedule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticRoutingModule {}
