import { NgModule } from '@angular/core';
import { ChangeScheduleComponent } from './change-schedule.component';
import { ChangeScheduleRoutingModule } from './change-schedule.routes';
import { TuiTabsModule } from '@taiga-ui/kit';
import { SharedChangeScheduleModule } from './_shared/shared.module';

const TAIGA_UI = [TuiTabsModule];

@NgModule({
  imports: [
    ChangeScheduleRoutingModule,
    SharedChangeScheduleModule,
    ...TAIGA_UI,
  ],
  declarations: [ChangeScheduleComponent],
})
export class ChangeScheduleModule {}
