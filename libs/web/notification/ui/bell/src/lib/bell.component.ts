import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { fadeInOut } from '@teaching-scheduling-system/core/ui/animations';
import {
  NotificationState,
  notification_getInitialData,
  notification_selectHasUnread,
} from '@teaching-scheduling-system/web/notification/data-access';
import {
  AppShellState,
  selectBreadcrumbs,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { BehaviorSubject, tap } from 'rxjs';

@Component({
  selector: 'tss-bell',
  templateUrl: './bell.component.html',
  styleUrls: ['./bell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'flat',
      shape: 'rounded',
      size: 's',
    }),
  ],
  animations: [fadeInOut],
})
export class BellComponent {
  // PUBLIC PROPERTIES
  readonly hasUnread$ = this.store.select(notification_selectHasUnread);
  readonly show$ = new BehaviorSubject<boolean>(false);
  openDropdown = false;

  // CONSTRUCTOR
  constructor(
    private readonly store: Store<NotificationState>,
    notificationStore: Store<NotificationState>,
    appShellStore: Store<AppShellState>
  ) {
    appShellStore
      .select(selectBreadcrumbs)
      .pipe(
        tap((breadcrumbs) => {
          const inNotificationPage =
            !!breadcrumbs[1]?.url.includes('notifications');
          this.show$.next(!inNotificationPage);
          if (inNotificationPage) {
            this.openDropdown = false;
          }
        })
      )
      .subscribe();

    notificationStore.dispatch(notification_getInitialData());
  }
}
