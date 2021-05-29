import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Account } from 'src/app/models/account';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { TransactionDataService } from 'src/app/services/transaction-data.service';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { AddTransactionDialogComponent } from './add-transaction-dialog/add-transaction-dialog.component';
import { accounts, State } from 'src/app/state';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppActions } from 'src/app/state/actions';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('addTransactionDialog') addTransactionDialog!: AddTransactionDialogComponent;
  account: Account | null = null;
  accounts: Array<Account> | null = null;
  transactions: Array<Transaction> = [];
  categories: Array<Category> = [];
  editTransaction: Transaction = {} as Transaction;
  isAddDialogVisible = false;
  isEditingRow = false;

  private isAccountsLoading = false;
  private isTransactionsLoading = false;
  private isCategoriesLoading = false;

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private store: Store<State>,
              private modalService: NgbModal,
              private categoryDataService: CategoryDataService,
              private transactionDataService: TransactionDataService) { }

  ngOnInit(): void {
    this.store.dispatch(AppActions.setIsLoading({ isLoading: true }));

    this.isAccountsLoading = true;
    this.subscriptions.push(this.store.select(accounts).subscribe(accounts => {
      this.accounts = accounts;

      this.route.params.subscribe(params => {
        this.store.dispatch(AppActions.setIsLoading({ isLoading: true }));
        if (params.account) {
          this.account = accounts.find(account => account.url === params.account) ?? null;

          if(this.account) {
            this.isTransactionsLoading = true;

            this.transactionDataService.getByAccount(this.account.id).subscribe(transactions => {
              this.transactions = transactions
                .map(transaction => ({ ...transaction, date: new Date(transaction.date)}))
                .sort((a, b) => b.date.getTime() - a.date.getTime());
              this.isTransactionsLoading = false;
              this.setIsLoading();
            }, error => {
              this.isTransactionsLoading = false;
              this.setIsLoading();
              console.error(error);
            });
          }
        } else {
          this.account = null;
          this.isTransactionsLoading = true;
          this.transactionDataService.get().subscribe(transactions => {
            this.transactions = transactions
              .map(transaction => ({ ...transaction, date: new Date(transaction.date)}))
              .sort((a, b) => b.date.getTime() - a.date.getTime());
            this.isTransactionsLoading = false;
            this.setIsLoading();
          }, error => {
            this.isTransactionsLoading = false;
            this.setIsLoading();
            console.error(error);
          });
        }
      });
      this.isAccountsLoading = false;
      this.setIsLoading();
    }, error => {
      this.isAccountsLoading = false;
      this.setIsLoading();
    }));
    this.categoryDataService.getSimple().subscribe(categories => {
      this.categories = categories;
      this.isCategoriesLoading = false;
      this.setIsLoading();
    }, error => {
      this.isCategoriesLoading = false;
      this.setIsLoading();
      console.error(error);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  setIsLoading(): void {
    if (!this.isAccountsLoading && !this.isCategoriesLoading && !this.isTransactionsLoading) {
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }));
    }
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
    this.store.dispatch(AppActions.setIsLoading({ isLoading: true }));
    this.transactionDataService.update(transaction).subscribe(updatedTransaction => {
      const transactionIndex = this.transactions.findIndex(t => t.id === updatedTransaction.id);
      this.transactions[transactionIndex] = updatedTransaction;
      this.sortTransactions();
      transaction.isEditing = false;
      this.isEditingRow = false;
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }));
    }, error => {
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }));
      console.error(error);
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

  sortTransactions(): void {
    this.transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  showAddTransactionDialog(): void {
    const modal = this.modalService.open(AddTransactionDialogComponent);
    modal.result.then((transaction: Transaction) => {
      this.transactions.push(transaction);
      this.sortTransactions();
    });
  }
}
