import { createAction } from '@ngrx/store';

export const reset = createAction('[App Shell Page] Reset');

export const tryAutoLogin = createAction('[App Shell Page] Auto Login');

export const loadRooms = createAction('[App Shell Page] Load rooms');
