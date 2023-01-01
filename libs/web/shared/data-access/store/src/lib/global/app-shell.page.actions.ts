import { createAction, props } from '@ngrx/store';

export const reset = createAction('[App Shell Page] Reset');

export const keepLogin = createAction('[App Shell Page] Keep Login');

export const logout = createAction('[App Shell Page] Logout');

export const loadRooms = createAction('[App Shell Page] Load rooms');

export const loadSchoolYear = createAction('[App Shell Page] Load school year');

export const loadAcademicYear = createAction(
  '[App Shell Page] Load academic year'
);

export const setLoader = createAction(
  '[App Shell Page] Set loader',
  props<{ showLoader: boolean }>()
);

export const setConnectToGoogle = createAction(
  '[App Shell Page] Set connect to google',
  props<{ connect: boolean }>()
);
