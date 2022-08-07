import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  templateUrl: './web-config.component.html',
  styleUrls: ['./web-config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebConfigComponent {
  // PUBLIC PROPERTIES
  inMaintenance = false;
}
