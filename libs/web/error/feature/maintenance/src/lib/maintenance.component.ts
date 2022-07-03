import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';

@Component({
  selector: 'teaching-scheduling-system-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceComponent {
  /** CONSTRUCTOR */
  constructor(@Inject(APP_CONFIG) public readonly config: AppConfig) {}
}
