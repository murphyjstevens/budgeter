import { Component, OnInit } from '@angular/core';
import { AccountDataService } from 'src/app/services/account-data.service';
import { Account } from '../../models/account';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  accounts: Array<Account> = [];

  constructor(private accountDataService: AccountDataService) { }

  ngOnInit(): void {
    this.accountDataService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }
}
