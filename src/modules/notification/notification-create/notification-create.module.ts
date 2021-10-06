import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationCreateComponent } from './notification-create.component';
import { NotificationCreateRoutingModule } from './notification-create.routes';

@NgModule({
  imports: [
    CommonModule,
    NotificationCreateRoutingModule
  ],
  declarations: [NotificationCreateComponent],
})
export class NotificationCreateModule { }
