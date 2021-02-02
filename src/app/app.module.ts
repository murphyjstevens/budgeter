import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BudgetComponent } from './components/budget/budget.component';
import { AccountComponent } from './components/account/account.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AddTransactionDialogComponent } from './components/account/add-transaction-dialog/add-transaction-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from './shared/delete-confirmation-modal/delete-confirmation-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    BudgetComponent,
    AccountComponent,
    SidebarComponent,
    AddTransactionDialogComponent,
    DeleteConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AutoCompleteModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    TreeTableModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
