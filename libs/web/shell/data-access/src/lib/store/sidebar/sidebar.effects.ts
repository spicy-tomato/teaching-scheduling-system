import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import * as ApiAction from './sidebar.api.actions';
import { SidebarField } from './sidebar.model.store';
import * as PageAction from './sidebar.page.actions';
import { sidebar_selectDataState } from './sidebar.selectors';
import { SidebarState } from './sidebar.state';

@Injectable()
export class SidebarEffects {
  /** PRIVATE PROPERTIES */
  private dataState$ = this.store.select(sidebar_selectDataState);

  /** EFFECTS */
  emit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.sidebar_emit),
      withLatestFrom(this.dataState$),
      map(([{ event }, dataState]) => {
        const state = { ...dataState };
        if (event.name === 'calendar.create') {
          (event.value as SidebarField[]).forEach((field) => {
            state[field] = true;
          });
        } else {
          state[event.name] = event.value;
        }

        return ApiAction.setDataState({ dataState: state });
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<SidebarState>
  ) {}
}
