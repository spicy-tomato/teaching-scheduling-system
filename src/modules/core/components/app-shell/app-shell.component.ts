import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { GoogleService } from '@services/core/google.service';
import { EApiStatus } from '@shared/enums';
import { takeUntil, tap } from 'rxjs/operators';
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

    store
      .select(fromAppShell.selectStatus)
      .pipe(
        tap((status) => {
          if (status === EApiStatus.unknown) {
            store.dispatch(fromAppShell.keepLogin());
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    googleService.load();
  }
}
