import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  AppShellState,
  logout,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { EchoService, NotificationService } from '../services';
import * as ApiAction from './notification.api.actions';
import * as PageAction from './notification.page.actions';
import { notification_selectProp } from './notification.selectors';
import { NotificationState } from './notification.state';

@Injectable()
export class NotificationEffects {
  // PRIVATE PROPERTIES
  private readonly uuidAccount$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    map((x) => x.uuidAccount)
  );

  // EFFECTS
  getDate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.notification_getInitialData),
        map(() => {
          PageAction.actions.forEach((action) => {
            this.store.dispatch(action());
          });
        })
      );
    },
    { dispatch: false }
  );

  getAll$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.notification_getAll),
      withLatestFrom(
        this.store.select(notification_selectProp('milestone')).pipe(
          map((x) => x[0]),
          ObservableHelper.filterNullish()
        ),
        this.uuidAccount$
      ),
      mergeMap(({ 1: milestone, 2: uuidAccount }) => {
        return this.notificationService
          .getAll(uuidAccount, {
            milestone,
            limit: 5,
          })
          .pipe(
            map((page) => ApiAction.notification_getAllSuccessful({ page })),
            catchError(() => of(ApiAction.notification_getAllFailed()))
          );
      })
    );
  });

  getUnread$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.notification_getUnread),
      withLatestFrom(
        this.store.select(notification_selectProp('milestone')).pipe(
          map((x) => x[1]),
          ObservableHelper.filterNullish()
        ),
        this.uuidAccount$
      ),
      mergeMap(({ 1: milestone, 2: uuidAccount }) => {
        return this.notificationService
          .getUnread(uuidAccount, {
            milestone,
            limit: 5,
          })
          .pipe(
            map((page) => ApiAction.notification_getUnreadSuccessful({ page })),
            catchError(() => of(ApiAction.notification_getUnreadFailed()))
          );
      })
    );
  });

  markAllAsRead$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.notification_markAllAsRead),
        withLatestFrom(this.uuidAccount$),
        mergeMap(({ 1: uuidAccount }) =>
          this.notificationService.markAllAsRead(uuidAccount)
        )
      );
    },
    { dispatch: false }
  );

  markAsRead$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.notification_markAsRead),
        withLatestFrom(this.uuidAccount$),
        mergeMap(({ 0: { id }, 1: uuidAccount }) =>
          this.notificationService.markAsRead(uuidAccount, id)
        )
      );
    },
    { dispatch: false }
  );

  resetAfterLogout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logout),
      map(() => PageAction.reset())
    );
  });

  // CONSTRUCTOR
  constructor(
    private readonly actions$: Actions,
    private readonly echoService: EchoService,
    private readonly notificationService: NotificationService,
    private readonly store: Store<NotificationState>,
    private readonly appShellStore: Store<AppShellState>
  ) {
    this.triggerGetInitialData();
    this.handleReceiveEchoMessage();
  }

  // PRIVATE METHODS
  private triggerGetInitialData(): void {
    this.uuidAccount$
      .pipe(
        filter((x) => !!x),
        tap(() => this.store.dispatch(PageAction.notification_getInitialData()))
      )
      .subscribe();
  }

  private handleReceiveEchoMessage(): void {
    this.echoService.message$
      .pipe(
        tap(({ content }) => {
          if (content) {
            this.store.dispatch(
              ApiAction.notification_add({ notification: content })
            );
          }
        })
      )
      .subscribe();
  }
}
