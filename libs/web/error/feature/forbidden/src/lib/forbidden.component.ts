import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppShellState,
  setLoader,
} from '@teaching-scheduling-system/web/shared/data-access/store';

@Component({
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenComponent {
  // CONSTRUCTOR
  constructor(appShellStore: Store<AppShellState>) {
    appShellStore.dispatch(setLoader({ showLoader: false }));
  }
}
