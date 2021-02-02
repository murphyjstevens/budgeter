import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Account } from 'src/app/models/account';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { AccountDataService } from 'src/app/services/account-data.service';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { TransactionDataService } from 'src/app/services/transaction-data.service';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { AddTransactionDialogComponent } from './add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class AccountComponent implements OnInit {
  @ViewChild('addTransactionDialog') addTransactionDialog!: AddTransactionDialogComponent;
  account: Account = {} as Account;
  transactions: Array<Transaction> = [];
  categories: Array<Category> = [];
  isAddDialogVisible: boolean = false;
  isEditingRow: boolean = false;

  constructor(private route: ActivatedRoute,
    private modalService: NgbModal,
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

  convertToMoney(event: any, transaction: Transaction) {
    if(!event.target.value) return;

    transaction.cost = Math.floor(parseFloat(event.target.value) * 100) / 100;

    event.target.value = transaction.cost;
  }

  save(transaction: Transaction) {
    this.transactionDataService.update(transaction).subscribe(updatedTransaction => {
      transaction.isEditing = false;
      this.isEditingRow = false;
    });
  }

  confirmDelete(transaction: Transaction) {
    const modal = this.modalService.open(DeleteConfirmationModalComponent)
    modal.componentInstance.title = 'Delete Transaction';
    modal.componentInstance.message = 'Would you like to delete this Transaction?';
    modal.result.then(result => {
      if(result) {
        this.delete(transaction);
      }
    }, () => { });
  }

  delete(transaction: Transaction) {
    this.transactionDataService.delete(transaction.id).subscribe();
  }
}
