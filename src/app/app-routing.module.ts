import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { BudgetComponent } from './components/budget/budget.component';

const routes: Routes = [
  { path: '', component: BudgetComponent },
  { path: 'accounts/:account', component: AccountComponent },
  { path: 'accounts', component: AccountComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
