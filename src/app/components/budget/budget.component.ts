import { Component, OnInit } from '@angular/core';
import { BudgetCategory } from 'src/app/models/budget-category';
import { CategoryDataService } from 'src/app/services/category-data.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  categories: Array<BudgetCategory> = [];
  constructor() { }

  ngOnInit(): void {
    CategoryDataService.get().subscribe(categories => {
      this.categories = categories;
    });
  }

  getAvailable(category: BudgetCategory) {
    return (category.budget - category.spent).toFixed(2);
  }
}
