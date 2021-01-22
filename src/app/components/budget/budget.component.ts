import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryDataService } from 'src/app/services/category-data.service';

import { TreeNode } from 'primeng/api';
import { zip } from 'rxjs/internal/observable/zip';
import { CategoryGroup } from 'src/app/models/category-group';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  budgets: Array<TreeNode> = [];
  month = 'Jan 2021';

  constructor(private categoryDataService: CategoryDataService) { }

  ngOnInit(): void {
    const categorySub = this.categoryDataService.get();
    const groupSub = this.categoryDataService.getGroups();
    zip(categorySub, groupSub).subscribe(([categories, categoryGroups]) => {
      this.budgets = categoryGroups.map(group => {
        return {
          data: group,
          children: categories.filter(category => category.categoryGroupId === group.id).map(category => {
            return { data: category } as TreeNode;
          }),
          expanded: true
        } as TreeNode;
      });
    });
  }

  getAvailable(data: Category | CategoryGroup): string | undefined {
    const category = data as Category;
    if (category.budget === undefined || category.spent === undefined) { return undefined; }

    return (category.budget - category.spent).toFixed(2);
  }

  onEditComplete(event: any) {
    console.log(event);
    console.log(event.data);
    console.log(event.originalEvent);
  }
}
