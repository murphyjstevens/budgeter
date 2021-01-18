import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { BudgetCategory } from '../models/budget-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryDataService {
  static budgetCategories: Array<BudgetCategory> = [
    {
      id: 1,
      name: 'Groceries',
      budget: 500.52,
      spent: 25.22
    } as BudgetCategory, {
      id: 2,
      name: 'Mortage',
      budget: 2000.00,
      spent: 0.00
    } as BudgetCategory
  ];

  constructor() { }

  static get(): Observable<Array<BudgetCategory>> {
    return of(CategoryDataService.budgetCategories as Array<BudgetCategory>)
  }
}
