import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { AccountDataService } from 'src/app/services/account-data.service';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { TransactionDataService } from 'src/app/services/transaction-data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account: Account = {} as Account;
  transactions: Array<Transaction> = [];
  categories: Array<Category> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      AccountDataService.getAccount(params['account']).subscribe(account => {
        this.account = account;
        TransactionDataService.get(this.account.id).subscribe(transactions => {
          this.transactions = transactions;
        });
      });
    });
    CategoryDataService.get().subscribe(categories => {
      this.categories = categories;
    });
  }

  getCategoryName(id: number): string {
    const category = this.categories.find(cat => cat.id === id);
    if(category){
      return category.name;
    } else {
      return '';
    }
  }
}
