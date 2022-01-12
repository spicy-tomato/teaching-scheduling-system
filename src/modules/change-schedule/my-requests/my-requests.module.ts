import { NgModule } from '@angular/core';
import { MyRequestsComponent } from './my-requests.component';
import { MyRequestsRoutingModule } from './my-requests.routes';
import { SharedChangeScheduleModule } from '../_shared/shared.module';

@NgModule({
  imports: [SharedChangeScheduleModule, MyRequestsRoutingModule],
  declarations: [MyRequestsComponent],
})
export class MyRequestsModule {}
