import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeScheduleComponent } from './change-schedule.component';
import { ChangeScheduleRoutingModule } from './change-schedule.routes';
import { RouterModule } from '@angular/router';
import { TuiTabsModule } from '@taiga-ui/kit';
import { DirectivesModule } from '@directives/directives.module';

const TAIGA_UI = [TuiTabsModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ChangeScheduleRoutingModule,
    DirectivesModule,
    ...TAIGA_UI,
  ],
  declarations: [ChangeScheduleComponent],
})
export class ChangeScheduleModule {}
