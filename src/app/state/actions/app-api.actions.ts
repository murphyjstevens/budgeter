import { createAction, props } from '@ngrx/store';
import { Account } from '../../models/account';

export const accountsLoadedSuccess = createAction(
  '[App API] Accounts Loaded Success',
  props<{ accounts: Array<Account> }>()
);

export const accountsLoadedError = createAction(
  '[App API] Accounts Loaded Error',
  props<{ error: string }>()
);
