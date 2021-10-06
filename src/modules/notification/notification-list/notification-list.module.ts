import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationListComponent } from './notification-list.component';
import { NotificationListRoutingModule } from './notification-list.routes';

@NgModule({
  imports: [
    CommonModule,
    NotificationListRoutingModule
  ],
  declarations: [NotificationListComponent],
})
export class NotificationListModule { }
