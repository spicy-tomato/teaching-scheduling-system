import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from './app-shell.component';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: async () => (await import('@modules/home/home.module')).HomeModule
      },
      {
        path: 'notification',
        loadChildren: async () => (await import('@modules/notification/notification.module')).NotificationModule
      },
      {
        path: 'schedule',
        loadChildren: async () => (await import('@modules/scheduler/scheduler.module')).SchedulerModule
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppShellRoutingModule { }
