import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionDataService {

  constructor() { }

  static get(accountId: number): Observable<Array<Transaction>> {
    switch(accountId) {
      case 1:
        return of([
          { id: 1, accountId: 1, date: new Date(), cost: 40.00, to: 'McDonalds', categoryId: 1 },
          { id: 2, accountId: 1, date: new Date(), cost: 12.23, to: 'Burger King', categoryId: 1 },
          { id: 3, accountId: 1, date: new Date(), cost: 50.91, to: 'McDonalds', categoryId: 1 },
          { id: 4, accountId: 1, date: new Date(), cost: 5.11, to: 'McDonalds', categoryId: 1 },
          { id: 5, accountId: 1, date: new Date(), cost: 2980.82, to: 'Walmart', categoryId: 1 }
        ]);
      case 2:
        return of([
          { id: 6, accountId: 2, date: new Date(), cost: 40.00, to: 'Cub Foods', categoryId: 1 },
          { id: 7, accountId: 2, date: new Date(), cost: 12.23, to: 'KFC', categoryId: 1 }
        ]);
      default:
        return of([]);
    }
  }
}
