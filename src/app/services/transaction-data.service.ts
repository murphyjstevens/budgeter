import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs/operators';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionDataService {
  apiUrl = 'https://localhost:5001/Transactions';

  constructor(private httpClient: HttpClient) { }

  get(accountId: number): Observable<Array<Transaction>> {
    return this.httpClient.get<Array<Transaction>>(`${this.apiUrl}/Account/${accountId}`).pipe(
      tap(transactions => transactions.map(transaction => ({ ...transaction, date: new Date(transaction.date)})))
    );
  }

  insert(transaction: Transaction): Observable<Transaction> {
    return this.httpClient.post<Transaction>(this.apiUrl, transaction).pipe(
      map(transaction => ({ ...transaction, date: new Date(transaction.date)}))
    );
  }

  update(transaction: Transaction): Observable<Transaction> {
    return this.httpClient.put<Transaction>(this.apiUrl, transaction).pipe(
      map(transaction => ({ ...transaction, date: new Date(transaction.date)}))
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
