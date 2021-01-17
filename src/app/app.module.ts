import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BudgetComponent } from './components/budget/budget.component';
import { AccountComponent } from './components/account/account.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    BudgetComponent,
    AccountComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
