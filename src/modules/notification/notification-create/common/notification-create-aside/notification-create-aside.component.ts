import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tss-notification-create-aside',
  templateUrl: './notification-create-aside.component.html',
  styleUrls: ['./notification-create-aside.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCreateAsideComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
