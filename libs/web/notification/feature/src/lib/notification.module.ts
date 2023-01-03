import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from './notification.component';
import { NotificationListModule } from '@teaching-scheduling-system/web/notification/ui/notification-list';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiScrollbarModule } from '@taiga-ui/core';

const TAIGA_UI = [TuiIslandModule, TuiScrollbarModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NotificationComponent }]),
    NotificationListModule,
    ...TAIGA_UI,
  ],
  declarations: [NotificationComponent],
})
export class NotificationFeatureModule {}
