import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppShellState,
  setLoader,
} from '@teaching-scheduling-system/web/shared/data-access/store';

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  // CONSTRUCTOR 
  constructor(appShellStore: Store<AppShellState>) {
    appShellStore.dispatch(setLoader({ showLoader: false }));
  }
}
