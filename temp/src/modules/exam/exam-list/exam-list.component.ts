import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamListComponent {}
