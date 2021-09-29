import { loginReducer } from "@modules/login/state";
import { createReducer, Store } from "@ngrx/store";

export interface AppState { }

const initialState = { };

export const appReducer = {
  login: loginReducer
}

