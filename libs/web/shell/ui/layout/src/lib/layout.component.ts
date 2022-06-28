import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { tap, take } from 'rxjs';
import * as fromAppShell from '@teaching-scheduling-system/web/shared/data-access/store';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  /** CONSTRUCTOR */
  constructor(
    store: Store<fromAppShell.AppShellState>
    // , googleService: GoogleService
  ) {
    store
      .select(fromAppShell.selectStatus)
      .pipe(
        tap((status) => {
          if (status !== EApiStatus.loading) {
            store.dispatch(fromAppShell.reset());
            store.dispatch(fromAppShell.keepLogin());
          }
        }),
        take(1)
      )
      .subscribe();

    // googleService.load();
  }
}
