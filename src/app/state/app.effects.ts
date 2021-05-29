import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AccountDataService } from '../services/account-data.service';
import { AppActions, AppApiActions } from './actions';

@Injectable()
export class AppEffects {

  constructor(private actions$: Actions, private accountDataService: AccountDataService) { }

  loadAccounts$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(AppActions.loadAccounts),
        mergeMap(() => this.accountDataService.getAccounts()
          .pipe(
            map(accounts => AppApiActions.accountsLoadedSuccess({ accounts })),
            catchError(error => of(AppApiActions.accountsLoadedError({ error })))
          )
        )
      );
  });
}
