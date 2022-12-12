import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiActiveZoneDirective, TuiDestroyService } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import {
  EchoMessage,
  NotificationState,
  notification_getData,
  notification_markAllAsRead,
  notification_markAsRead,
  notification_selectHasUnread,
  notification_selectProp,
} from '@teaching-scheduling-system/web/notification/data-access';
import {
  AppShellState,
  selectNameTitle,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { BehaviorSubject, filter, takeUntil, tap } from 'rxjs';
import {
  NotificationListOptions,
  NOTIFICATION_LIST_OPTIONS,
} from './notification-list.token';

@Component({
  selector: 'tss-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiButtonOptionsProvider({
      appearance: 'flat',
      shape: 'rounded',
      size: 's',
    }),
  ],
})
export class NotificationListComponent {
  // INPUT
  @Input() activeZone?: TuiActiveZoneDirective;

  // PUBLIC PROPERTIES
  readonly tabsBtn = ['Tất cả', 'Chưa đọc'];
  readonly data$ = this.store.select(notification_selectProp('data'));
  readonly hasNext$ = this.store.select(notification_selectProp('hasNext'));
  readonly hasUnread$ = this.store.select(notification_selectHasUnread);
  readonly nameTitle$ = this.appShellStore.select(selectNameTitle);
  readonly activeTabIndex$ = new BehaviorSubject<number>(0);
  openDropdown = false;
  openOptions = false;

  // CONSTRUCTOR
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    @Inject(NOTIFICATION_LIST_OPTIONS)
    public readonly options: NotificationListOptions,
    private readonly store: Store<NotificationState>,
    private readonly appShellStore: Store<AppShellState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.handleDataChange();
  }

  // PUBLIC METHODS
  notificationCountMatcher = (item: EchoMessage) => !item.readAt;

  onSeeMore(tabIndex: number): void {
    this.store.dispatch(notification_getData(tabIndex)());
  }

  markAllAsRead(): void {
    this.store.dispatch(notification_markAllAsRead());
    this.openOptions = false;
  }

  openNotification(): void {
    void this.router.navigate(['/notifications']);
    this.openOptions = false;
  }

  markAsRead(id: number): void {
    this.store.dispatch(notification_markAsRead({ id }));
  }

  // PRIVATE METHODS
  private handleDataChange(): void {
    this.data$
      .pipe(
        filter((notificationTypes) =>
          notificationTypes.some(({ length }) => length > 0)
        ),
        tap(() => this.cdr.markForCheck()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
