import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { CategoryGroup } from 'src/app/models/category-group';
import { zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { AppActions } from 'src/app/state/actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  categoryGroups: Array<CategoryGroup> = [];
  month = 'Jan 2021';

  constructor(private categoryDataService: CategoryDataService,
              private store: Store<State>,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.store.dispatch(AppActions.setIsLoading({ isLoading: true }));
    const categorySub = this.categoryDataService.get();
    const groupSub = this.categoryDataService.getGroups();
    zip(categorySub, groupSub).subscribe(([categories, categoryGroups]) => {
      this.categoryGroups = categoryGroups.map((group: CategoryGroup) => {
        return {
          ...group,
          categories: categories.filter((category: Category) => category.categoryGroupId === group.id),
          isExpanded: true
        } as CategoryGroup
      });
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }));
    }, error => {
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }));
      console.error(error);
    });
  }

  calculateAvailable(data: Category | CategoryGroup): number | undefined {
    const category = data as Category;
    if (category.budget === undefined || category.spent === undefined) { return undefined; }

    return (category.budget - category.spent);
  }

  calculateGroupTotals(group: CategoryGroup, column: string): number | undefined {
    if(!group.categories.length) {
      return undefined;
    }

    let numberArray: Array<number> = [];
    switch (column) {
      case 'budgeted':
        numberArray = group.categories.map(category => this.calculateAvailable(category) as number);
        break;
      case 'spent':
        numberArray = group.categories.map(category => this.calculateAvailable(category) as number);
        break;
      case 'available':
        numberArray = group.categories.map(category => this.calculateAvailable(category) as number);
        break;
    }
    return numberArray.reduce((previous, current) => previous + current);
  }

  openAddCategoryDialog(categoryGroupId: number) {
    const modal = this.modalService.open(AddCategoryDialogComponent);
    modal.componentInstance.setCategoryGroupId(categoryGroupId);
    modal.result.then((category: Category) => {
      let categoryGroup = this.categoryGroups.find(group => group.id === category.categoryGroupId);
      if (categoryGroup) {
        categoryGroup.categories.push(category);
        categoryGroup.categories.sort((a: Category, b: Category) => a.name < b.name ? -1 : 1);
      }
    });
  }
}
