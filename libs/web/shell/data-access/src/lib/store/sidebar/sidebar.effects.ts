import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  AppShellState,
  selectGoogleCalendars,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { map, withLatestFrom } from 'rxjs';
import * as ApiAction from './sidebar.api.actions';
import { SidebarField } from './sidebar.model.store';
import * as PageAction from './sidebar.page.actions';
import { sidebar_selectDataState } from './sidebar.selectors';
import { SidebarState } from './sidebar.state';

@Injectable()
export class SidebarEffects {
  // PRIVATE PROPERTIES
  private readonly dataState$ = this.store.select(sidebar_selectDataState);
  private readonly googleCalendars$ = this.appShellStore.select(
    selectGoogleCalendars
  );

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

  // CONSTRUCTOR
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<SidebarState>,
    private readonly appShellStore: Store<AppShellState>
  ) {}
}
