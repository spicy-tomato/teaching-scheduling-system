import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import * as fromAppShell from './state';

@Component({
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent extends BaseComponent {
  /** CONSTRUCTOR */
  constructor(private readonly store: Store<fromAppShell.AppShellState>) {
    super();
    
    this.store.dispatch(fromAppShell.reset());
    this.store.dispatch(fromAppShell.tryAutoLogin());
  }
}
