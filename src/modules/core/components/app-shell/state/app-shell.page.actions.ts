import { createAction, props } from '@ngrx/store';

export const reset = createAction(
  '[App Shell Page] Reset',
  props<{ fromGuard: boolean }>()
);

export const keepLogin = createAction('[App Shell Page] Keep Login');

export const loadRooms = createAction('[App Shell Page] Load rooms');
