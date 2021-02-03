import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/models/account';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { AccountDataService } from 'src/app/services/account-data.service';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { TransactionDataService } from 'src/app/services/transaction-data.service';
import { NumberValidator } from 'src/app/shared/validators/number.validator';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.css']
})
export class AddTransactionDialogComponent implements OnInit {
  @Input() defaultAccount: Account | null = null;
  @Output() onAdd: EventEmitter<Transaction> = new EventEmitter();
  isDialogVisible: boolean = false;
  accounts: Array<Account> = [];
  categories: Array<Category> = [];

  addTransactionForm: FormGroup = this.formBuilder.group({
    date: ['', Validators.required],
    accountId: ['', Validators.required],
    categoryId: ['', Validators.required],
    cost: ['', [Validators.required, NumberValidator]],
    recipient: ['', Validators.required]
  });

  get date() { return this.addTransactionForm.get('date'); }
  get accountId() { return this.addTransactionForm.get('accountId'); }
  get categoryId() { return this.addTransactionForm.get('categoryId'); }
  get cost() { return this.addTransactionForm.get('cost'); }
  get recipient() { return this.addTransactionForm.get('recipient'); }

  constructor(private formBuilder: FormBuilder,
    private transactionDataService: TransactionDataService,
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

  convertToMoney(event: any) {
    if(!event.target.value) return;

    let cost = Math.round(event.target.value * 100) / 100;
    this.addTransactionForm.get('cost')?.setValue(cost);
  }

  show() {
    this.isDialogVisible = true;
    let today = new Date();
    this.addTransactionForm.patchValue({ 
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0), 
      accountId: this.defaultAccount?.id
    } as Transaction);
  }

  hide() {
    this.isDialogVisible = false;
  }

  add() {
    let transaction = this.addTransactionForm.getRawValue() as Transaction;
    this.transactionDataService.insert(transaction).subscribe(updatedTransaction => {
      this.onAdd.emit(updatedTransaction);
      this.hide();
    });
  }
}