import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountDataService {
  static accounts: Array<Account> = [
    { id: 1, name: 'Checking', url: 'checking' } as Account, 
    { id: 2, name: 'Credit Card', url: 'credit-card' } as Account
  ];
  constructor() { }

  static getAccounts(): Observable<Array<Account>> {
    return of(AccountDataService.accounts);
  }

  static getAccount(url: string): Observable<Account> {
    const account = AccountDataService.accounts.find(account => account.url === url);
    if (account)
      return of(account);
    else
      return of({} as Account);
  }
}
