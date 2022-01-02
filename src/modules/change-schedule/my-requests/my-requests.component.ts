import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRequestsComponent {}
