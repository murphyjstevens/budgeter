import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      categoryGroupId: 1
    } as Category, {
      id: 2,
      name: 'Mortage',
      budget: 2000.00,
      spent: 0.00,
      categoryGroupId: 1
    } as Category, {
      id: 3,
      name: 'Dining Out',
      budget: 111.00,
      spent: 10.00,
      categoryGroupId: 2
    } as Category
  ];
  apiUrl = 'https://localhost:5001';

  constructor(private httpClient: HttpClient) { }

  get(): Observable<Array<Category>> {
    return this.httpClient.get<Array<Category>>(`${this.apiUrl}/Categories`);
  }

  getGroups(): Observable<Array<CategoryGroup>> {
    return this.httpClient.get<Array<CategoryGroup>>(`${this.apiUrl}/CategoryGroups`);
  }
}
