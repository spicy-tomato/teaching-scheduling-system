import { Component, Input } from '@angular/core';

@Component({
  selector: 'tss-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent {
  /** INPUT */
  @Input() public code!: number;
  @Input() public message!: string;
}
