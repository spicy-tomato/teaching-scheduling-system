import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  AppShellState,
  setLoader,
} from '@teaching-scheduling-system/web/shared/data-access/store';

@Component({
  selector: 'teaching-scheduling-system-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceComponent {
  /** CONSTRUCTOR */
  constructor(
    @Inject(APP_CONFIG) readonly config: AppConfig,
    appShellStore: Store<AppShellState>
  ) {
    appShellStore.dispatch(setLoader({ showLoader: false }));
  }
}
