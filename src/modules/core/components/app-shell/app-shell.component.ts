import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { GoogleService } from '@services/core/google.service';
import * as fromAppShell from './state';

@Component({
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent extends BaseComponent {
  /** CONSTRUCTOR */
  constructor(
    store: Store<fromAppShell.AppShellState>,
    googleService: GoogleService
  ) {
    super();

    store.dispatch(fromAppShell.reset());
    store.dispatch(fromAppShell.keepLogin());

    googleService.load();
  }
}
