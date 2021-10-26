import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { isLoading, State } from './state'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'budgeter';
  isLoading$: Observable<boolean>;

  constructor (store: Store<State>) {
    this.isLoading$ = store.select(isLoading)
  }
}
