import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'tss-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  /** INPUT */
  @Input() public code!: number;
  @Input() public message!: string;
}
