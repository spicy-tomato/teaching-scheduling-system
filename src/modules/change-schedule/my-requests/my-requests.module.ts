import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRequestsComponent } from './my-requests.component';
import { MyRequestsRoutingModule } from './my-requests.routes';

@NgModule({
  imports: [CommonModule, MyRequestsRoutingModule],
  declarations: [MyRequestsComponent],
})
export class MyRequestsModule {}
