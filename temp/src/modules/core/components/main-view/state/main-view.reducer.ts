import { createReducer, on } from '@ngrx/store';
import { MainViewState } from './main-view.state';
import * as PageAction from './main-view.page.actions';

const initialState: MainViewState = {
  breadcrumbs: [],
};

export const mainViewFeatureKey = 'mainView';

export const mainViewReducer = createReducer(
  initialState,
  on(PageAction.update, (state, action) => ({
    ...state,
    breadcrumbs: action.breadcrumbs,
  }))
);
