import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, of } from 'rxjs'
import { accounts, State } from 'src/app/state'
import { AppActions } from 'src/app/state/actions'
import { Account } from '../../models/account'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  accounts$: Observable<Array<Account>> = of();

  constructor (private store: Store<State>) { }

  ngOnInit (): void {
    this.accounts$ = this.store.select(accounts)

    this.store.dispatch(AppActions.loadAccounts())
  }
}
