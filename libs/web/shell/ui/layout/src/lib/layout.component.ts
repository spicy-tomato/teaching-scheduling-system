import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppShellState,
  keepLogin,
  reset,
  selectStatus,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { take, tap } from 'rxjs';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  // CONSTRUCTOR
  constructor(
    store: Store<AppShellState>
    // , googleService: GoogleService
  ) {
    store
      .select(selectStatus)
      .pipe(
        tap((status) => {
          if (status === 'unknown') {
            store.dispatch(reset());
            store.dispatch(keepLogin());
          }
        }),
        take(1)
      )
      .subscribe();

    // googleService.load();
  }
}
