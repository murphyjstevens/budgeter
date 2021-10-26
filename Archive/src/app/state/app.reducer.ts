import { Action, createReducer, on } from '@ngrx/store'
import * as AppActions from './actions/app.actions'
import { Account } from '../models/account'
import { AppApiActions } from './actions'

export interface AppState {
  isLoading: boolean;
  accounts: Array<Account>;
  error: string;
}

const initialState: AppState = {
  isLoading: false,
  accounts: [],
  error: ''
}

// const getAccountsFeature = (state: State) => state;

const appReducer = createReducer<AppState>(
  initialState,
  on(AppActions.setIsLoading, (state, action): AppState => {
    return {
      ...state,
      isLoading: action.isLoading
    }
  }),
  on(AppApiActions.accountsLoadedSuccess, (state, action): AppState => {
    return {
      ...state,
      accounts: action.accounts,
      error: ''
    }
  }),
  on(AppApiActions.accountsLoadedError, (state, action): AppState => {
    return {
      ...state,
      accounts: [],
      error: action.error
    }
  })
)

export function reducer (state: AppState | undefined, action: Action): AppState {
  return appReducer(state, action)
}

export const selectIsLoading = (state: AppState) => state.isLoading

export const selectAccounts = (state: AppState) => state.accounts

export const selectError = (state: AppState) => state.error
