import { createAction, props } from '@ngrx/store'

export const setIsLoading = createAction(
  '[App] Set Is Loading',
  props<{ isLoading: boolean }>()
)

export const loadAccounts = createAction(
  '[App] Load Accounts'
)
