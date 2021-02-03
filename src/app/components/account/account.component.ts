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
import { LoadingModalComponent } from 'src/app/shared/loading-modal/loading-modal.component';
import { AddTransactionDialogComponent } from './add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class AccountComponent implements OnInit {
  @ViewChild('addTransactionDialog') addTransactionDialog!: AddTransactionDialogComponent;
  account: Account | null = null;
  accounts: Array<Account> | null = null;
  transactions: Array<Transaction> = [];
  categories: Array<Category> = [];
  editTransaction: Transaction = {} as Transaction;
  isAddDialogVisible = false;
  isEditingRow = false;

  constructor(private route: ActivatedRoute,
              private modalService: NgbModal,
              private categoryDataService: CategoryDataService,
              private accountDataService: AccountDataService,
              private transactionDataService: TransactionDataService) { }

  ngOnInit(): void {
    // this.modalService.open(LoadingModalComponent, { backdrop: 'static', keyboard: false, centered: true, size: 'sm' });
    this.route.params.subscribe(params => {
      if (params.account) {
        this.accountDataService.getAccount(params.account).subscribe(account => {
          this.account = account;
          this.transactionDataService.getByAccount(this.account.id).subscribe(transactions => {
            this.transactions = transactions
              .map(transaction => ({ ...transaction, date: new Date(transaction.date)}))
              .sort((a, b) => b.date.getTime() - a.date.getTime());
          });
        });
      } else {
        this.account = null;
        this.accountDataService.getAccounts().subscribe(accounts => {
          this.accounts = accounts;
        });
        this.transactionDataService.get().subscribe(transactions => {
          this.transactions = transactions
            .map(transaction => ({ ...transaction, date: new Date(transaction.date)}))
            .sort((a, b) => b.date.getTime() - a.date.getTime());
        });
      }
    });
    this.categoryDataService.get().subscribe(categories => {
      this.categories = categories;
    });
  }

  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : '';
  }

  getAccountName(id: number): string {
    const account = this.accounts?.find(a => a.id === id);
    return account ? account.name : '';
  }

  convertToMoney(event: any, transaction: Transaction): void {
    if (!event.target.value) { return; }

    transaction.cost = Math.round(event.target.value * 100) / 100;

    event.target.value = transaction.cost;
  }

  startEditing(transaction: Transaction): any {
    const unsavedTransaction = this.transactions.find(t => t.isEditing);
    if (unsavedTransaction) {
      this.cancelEditing(unsavedTransaction);
    }
    this.editTransaction = { ...transaction } as Transaction;
    transaction.isEditing = true;
  }

  cancelEditing(transaction: Transaction): void {
    transaction.isEditing = false;
  }

  save(transaction: Transaction): void {
    this.transactionDataService.update(transaction).subscribe(updatedTransaction => {
      const transactionIndex = this.transactions.findIndex(t => t.id === updatedTransaction.id);
      this.transactions[transactionIndex] = updatedTransaction;
      this.sortTransactions();
      transaction.isEditing = false;
      this.isEditingRow = false;
    });
  }

  confirmDelete(transaction: Transaction): void {
    const modal = this.modalService.open(DeleteConfirmationModalComponent);
    modal.componentInstance.title = 'Delete Transaction';
    modal.componentInstance.message = 'Would you like to delete this Transaction?';
    modal.result.then(result => {
      if (result) {
        this.delete(transaction);
      }
    }, () => { });
  }

  delete(transaction: Transaction): void {
    this.transactionDataService.delete(transaction.id).subscribe(() => {
      this.transactions.splice(this.transactions.findIndex(t => t.id === transaction.id), 1);
    });
  }

  onNewTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.sortTransactions();
  }

  sortTransactions(): void {
    this.transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
