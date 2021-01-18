import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';
import { AccountDataService } from 'src/app/services/account-data.service';
import { TransactionDataService } from 'src/app/services/transaction-data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account: Account = {} as Account;
  transactions: Array<Transaction> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      AccountDataService.getAccount(params['account']).subscribe(account => {
        this.account = account;
        TransactionDataService.get(this.account.id).subscribe(transactions => {
          this.transactions = transactions;
        })
      });
    });
  }

  formatDate(value: Date) {
    if(!value) return;
    return `${value.getMonth()+1}/${value.getDate()}/${value.getFullYear()}`;
  }

  formatCurrency(value: number) {
    if(!value) return '';
    return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  }
}
