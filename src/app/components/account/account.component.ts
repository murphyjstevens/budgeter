import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { AccountDataService } from 'src/app/services/account-data.service';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { TransactionDataService } from 'src/app/services/transaction-data.service';
import { AddTransactionDialogComponent } from './add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @ViewChild('addTransactionDialog') addTransactionDialog!: AddTransactionDialogComponent;
  account: Account = {} as Account;
  transactions: Array<Transaction> = [];
  categories: Array<Category> = [];
  isAddDialogVisible: boolean = false;

  constructor(private route: ActivatedRoute,
    private categoryDataService: CategoryDataService,
    private accountDataService: AccountDataService,
    private transactionDataService: TransactionDataService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountDataService.getAccount(params.account).subscribe(account => {
        this.account = account;
        this.transactionDataService.get(this.account.id).subscribe(transactions => {
          this.transactions = transactions.map(transaction => ({ ...transaction, date: new Date(transaction.date)}));
        });
      });
    });
    this.categoryDataService.get().subscribe(categories => {
      this.categories = categories;
    });
  }

  getCategoryName(id: number): string {
    const category = this.categories.find(cat => cat.id === id);
    if (category) {
      return category.name;
    } else {
      return '';
    }
  }

  save(transaction: Transaction) {
    this.transactionDataService.update(transaction).subscribe(transaction => {
      console.log(transaction);
    });
  }

  delete(transaction: Transaction) {
    this.transactionDataService.delete(transaction.id).subscribe();
  }
}
