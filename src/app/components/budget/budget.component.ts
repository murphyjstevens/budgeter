import { Component, OnInit } from '@angular/core';
import { BudgetCategory } from 'src/app/models/budget-category';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  categories: Array<BudgetCategory> = [];
  constructor() { }

  ngOnInit(): void {
    this.categories = [{
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
  }

  getAvailable(category: BudgetCategory) {
    return (category.budget - category.spent).toFixed(2);
  }
}
