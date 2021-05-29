import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  @Output() save: EventEmitter<Transaction> = new EventEmitter();
  title: string = 'Add Transaction';
  accounts: Array<Account> = [];
  categories: Array<Category> = [];

  addTransactionForm: FormGroup = this.formBuilder.group({
    date: ['', Validators.required],
    accountId: ['', Validators.required],
    categoryId: ['', Validators.required],
    cost: ['', [Validators.required, NumberValidator]],
    recipient: ['', Validators.required]
  });

  get date(): AbstractControl | null { return this.addTransactionForm.get('date'); }
  get accountId(): AbstractControl | null { return this.addTransactionForm.get('accountId'); }
  get categoryId(): AbstractControl | null { return this.addTransactionForm.get('categoryId'); }
  get cost(): AbstractControl | null { return this.addTransactionForm.get('cost'); }
  get recipient(): AbstractControl | null { return this.addTransactionForm.get('recipient'); }

  constructor(public modal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private transactionDataService: TransactionDataService,
              private accountDataService: AccountDataService,
              private categoryDataService: CategoryDataService) { }

  ngOnInit(): void {
    this.accountDataService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
    this.categoryDataService.getSimple().subscribe(categories => {
      this.categories = categories;
    });
  }

  convertToMoney(event: any): void {
    if (!event.target.value) { return; }

    const cost = Math.round(event.target.value * 100) / 100;
    this.addTransactionForm.get('cost')?.setValue(cost);
  }

  initialize(): void {
    const today = new Date();
    this.addTransactionForm.patchValue({
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0),
      accountId: this.defaultAccount?.id
    } as Transaction);
  }

  add(): void {
    const transaction = this.addTransactionForm.getRawValue() as Transaction;
    this.transactionDataService.insert(transaction).subscribe(updatedTransaction => {
      this.modal.close(updatedTransaction);
    });
  }
}
