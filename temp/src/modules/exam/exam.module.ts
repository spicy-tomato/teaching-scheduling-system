import { NgModule } from '@angular/core';
import { ExamComponent } from './exam.component';
import { ExamRoutingModule } from './exam.routes';

@NgModule({
  imports: [ExamRoutingModule],
  declarations: [ExamComponent],
})
export class ExamModule {}
