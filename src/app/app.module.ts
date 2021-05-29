import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BudgetComponent } from './components/budget/budget.component';
import { AccountComponent } from './components/account/account.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AddTransactionDialogComponent } from './components/account/add-transaction-dialog/add-transaction-dialog.component';
import { DeleteConfirmationModalComponent } from './shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { reducers } from './state';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './state/app.effects';
import { AddCategoryDialogComponent } from './components/budget/add-category-dialog/add-category-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    BudgetComponent,
    AccountComponent,
    SidebarComponent,
    AddTransactionDialogComponent,
    AddCategoryDialogComponent,
    DeleteConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([AppEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
