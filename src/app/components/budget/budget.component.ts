import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryDataService } from 'src/app/services/category-data.service';

import { TreeNode } from 'primeng/api';
import { CategoryGroup } from 'src/app/models/category-group';
import { zip } from 'rxjs';
import { group } from '@angular/animations';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  categoryGroups: Array<CategoryGroup> = [];
  month = 'Jan 2021';

  constructor(private categoryDataService: CategoryDataService) { }

  ngOnInit(): void {
    const categorySub = this.categoryDataService.get();
    const groupSub = this.categoryDataService.getGroups();
    zip(categorySub, groupSub).subscribe(([categories, categoryGroups]) => {
      this.categoryGroups = categoryGroups.map((group: CategoryGroup) => {
        return {
          ...group,
          categories: categories.filter((category: Category) => category.categoryGroupId === group.id)
        } as CategoryGroup
      });
    });
  }

  getAvailable(data: Category | CategoryGroup): string | undefined {
    const category = data as Category;
    if (category.budget === undefined || category.spent === undefined) { return undefined; }

    return (category.budget - category.spent).toFixed(2);
  }

  onEditComplete(event: any): void {
    console.log(event);
    console.log(event.data);
    console.log(event.originalEvent);
  }
}
