import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiScrollbarModule } from '@taiga-ui/core';
import { ChangeRequestFilterModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-request-filter';
import { ChangeRequestListModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-request-list';
import { ChangeRequestPaginationModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-request-pagination';
import { ChangeRequestComponent } from './change-request.component';

const TAIGA_UI = [TuiScrollbarModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChangeRequestComponent,
      },
    ]),
    ChangeRequestFilterModule,
    ChangeRequestPaginationModule,
    ChangeRequestListModule,
    ...TAIGA_UI,
  ],
  declarations: [ChangeRequestComponent],
  exports: [ChangeRequestComponent],
})
export class ChangeRequestModule {}
