import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamComponent {}
