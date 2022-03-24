import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignScheduleImportComponent } from './assign-schedule-import.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Import',
    },
    component: AssignScheduleImportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignScheduleImportRoutingModule {}
