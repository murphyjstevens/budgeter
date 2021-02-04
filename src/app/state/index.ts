import { ActionReducerMap, createSelector } from '@ngrx/store';
import * as Reducer from './app.reducer';

export interface State {
  app: Reducer.AppState
}

export const reducers: ActionReducerMap<State> = {
  app: Reducer.reducer
}

export const selectAppState = (state: State) => state.app;
export const isLoading = createSelector(
  selectAppState,
  Reducer.selectIsLoading
);

export const accounts = createSelector(
  selectAppState,
  Reducer.selectAccounts
);

export const error = createSelector(
  selectAppState,
  Reducer.selectError
);