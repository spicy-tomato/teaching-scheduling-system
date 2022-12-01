import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import { GoogleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  catchError,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import * as ApiAction from './sidebar.api.actions';
import { SidebarField } from './sidebar.model.store';
import * as PageAction from './sidebar.page.actions';
import { sidebar_selectDataState } from './sidebar.selectors';
import { SidebarState } from './sidebar.state';

@Injectable()
export class SidebarEffects {
  // PRIVATE PROPERTIES
  private readonly dataState$ = this.store.select(sidebar_selectDataState);
  private readonly teacher$: Observable<Teacher>;

  // EFFECTS
  emit$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.sidebar_emit),
        withLatestFrom(this.dataState$),
        map(([{ event }, dataState]) => {
          const state = { ...dataState };
          switch (event.name) {
            case 'calendar.create':
              (event.value as SidebarField[]).forEach((field) => {
                state[field] = true;
              });
              break;

            default:
              state[event.name] = event.value;
              break;
          }

          this.store.dispatch(ApiAction.setDataState({ dataState: state }));
        })
      );
    },
    { dispatch: false }
  );

  loadGoogleCalendarList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.sidebar_loadGoogleCalendarList),
      switchMap(({ uuidAccount }) =>
        this.googleService.getCalendarList(uuidAccount).pipe(
          map(({ data }) =>
            ApiAction.loadGoogleCalendarListSuccessful({ list: data })
          ),
          catchError(() => of(ApiAction.loadGoogleCalendarListFailure()))
        )
      )
    );
  });

  // CONSTRUCTOR
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<SidebarState>,
    private readonly googleService: GoogleService,
    appShellStore: Store<AppShellState>
  ) {
    this.teacher$ = appShellStore.pipe(selectNotNullTeacher);
    this.handleLoadGoogleCalendarList();
  }

  // PRIVATE METHODS
  private handleLoadGoogleCalendarList(): void {
    this.teacher$
      .pipe(
        filter((t) => t.settings.googleCalendar),
        tap(({ uuidAccount }) => {
          this.store.dispatch(
            PageAction.sidebar_loadGoogleCalendarList({ uuidAccount })
          );
        })
      )
      .subscribe();
  }
}
