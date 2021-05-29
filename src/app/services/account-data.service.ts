import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/internal/Observable'
import { Account } from '../models/account'

@Injectable({
  providedIn: 'root'
})
export class AccountDataService {
  constructor (private httpClient: HttpClient) { }
  apiUrl = 'https://localhost:5001';

  getAccounts (): Observable<Array<Account>> {
    return this.httpClient.get<Array<Account>>(`${this.apiUrl}/Accounts`)
  }

  getAccount (url: string): Observable<Account> {
    return this.httpClient.get<Account>(`${this.apiUrl}/Accounts/Url/${url}`)
  }
}
