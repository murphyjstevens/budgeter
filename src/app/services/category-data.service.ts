import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Category } from '../models/category';
import { CategoryGroup } from '../models/category-group';

@Injectable({
  providedIn: 'root'
})
export class CategoryDataService {
  static budgetCategories: Array<Category> = [
    {
      id: 1,
      name: 'Groceries',
      budget: 500.52,
      spent: 25.22,
      groupId: 1
    } as Category, {
      id: 2,
      name: 'Mortage',
      budget: 2000.00,
      spent: 0.00,
      groupId: 1
    } as Category, {
      id: 3,
      name: 'Dining Out',
      budget: 111.00,
      spent: 10.00,
      groupId: 2
    } as Category
  ];

  constructor() { }

  static get(): Observable<Array<Category>> {
    return of(CategoryDataService.budgetCategories as Array<Category>);
  }

  static getGroups(): Observable<Array<CategoryGroup>> {
    return of([
      { id: 1, name: 'Necessary' },
      { id: 2, name: 'Fun Stuff' }
    ]);
  }
}
