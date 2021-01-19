import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionDataService {

  constructor(private httpClient: HttpClient) { }
  apiUrl = 'https://localhost:5001';

  get(accountId: number): Observable<Array<Transaction>> {
    return this.httpClient.get<Array<Transaction>>(`${this.apiUrl}/Transactions/Account/${accountId}`);
  }
}
