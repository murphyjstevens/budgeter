import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/internal/Observable'
import { Recipient } from '../models/recipient'

@Injectable({
  providedIn: 'root'
})
export class RecipientDataService {
  apiUrl = 'https://localhost:5001/Recipients';

  constructor (private httpClient: HttpClient) { }

  get (): Observable<Array<Recipient>> {
    return this.httpClient.get<Array<Recipient>>(this.apiUrl)
  }

  add (recipient: Recipient): Observable<Recipient> {
    return this.httpClient.post<Recipient>(this.apiUrl, recipient)
  }

  update (recipient: Recipient): Observable<Recipient> {
    return this.httpClient.put<Recipient>(this.apiUrl, recipient)
  }

  delete (id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`)
  }
}
