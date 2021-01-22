import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { AccountDataService } from 'src/app/services/account-data.service';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { TransactionDataService } from 'src/app/services/transaction-data.service';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.css']
})
export class AddTransactionDialogComponent implements OnInit {
  isDialogVisible: boolean = false;
  transaction: Transaction = {} as Transaction;
  accounts: Array<Account> = [];
  categories: Array<Category> = [];

  constructor(private transactionDataService: TransactionDataService,
    private accountDataService: AccountDataService,
    private categoryDataService: CategoryDataService) { }

  ngOnInit(): void {
    this.accountDataService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
    this.categoryDataService.get().subscribe(categories => {
      this.categories = categories;
    });
  }

  show() {
    this.isDialogVisible = true;
    this.transaction = {} as Transaction;
  }

  hide() {
    this.isDialogVisible = false;
  }

  add() {
    console.log(this.transaction);
    // this.transactionDataService.insert(this.transaction).subscribe();
  }
}
