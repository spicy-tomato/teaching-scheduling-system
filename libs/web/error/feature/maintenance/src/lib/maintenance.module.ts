import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiLinkModule } from '@taiga-ui/core';
import { MaintenanceComponent } from './maintenance.component';

const TAIGA_UI = [TuiLinkModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MaintenanceComponent }]),
    ...TAIGA_UI,
  ],
  declarations: [MaintenanceComponent],
  exports: [MaintenanceComponent],
})
export class MaintenanceModule {}
