import { Component, OnInit, ViewChild } from '@angular/core'
import { Category } from 'src/app/models/category'
import { CategoryDataService } from 'src/app/services/category-data.service'
import { CategoryGroup } from 'src/app/models/category-group'
import { zip } from 'rxjs'
import { Store } from '@ngrx/store'
import { State } from 'src/app/state'
import { AppActions } from 'src/app/state/actions'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component'
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component'

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  @ViewChild('categoryRenamePopover') categoryRenamePopover: any;
  categoryGroups: Array<CategoryGroup> = [];
  month: string = 'Jan 2021';
  isEditingRow: boolean = false;

  modifiedBudget: number = 0;
  renameText: string = '';

  constructor (private categoryDataService: CategoryDataService,
              private store: Store<State>,
              private modalService: NgbModal) { }

  ngOnInit (): void {
    this.store.dispatch(AppActions.setIsLoading({ isLoading: true }))
    const categorySub = this.categoryDataService.get()
    const groupSub = this.categoryDataService.getGroups()
    zip(categorySub, groupSub).subscribe(([categories, categoryGroups]) => {
      this.categoryGroups = categoryGroups.map((group: CategoryGroup) => {
        return {
          ...group,
          categories: categories.filter((category: Category) => category.categoryGroupId === group.id),
          isExpanded: true
        } as CategoryGroup
      })
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
    }, error => {
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
      console.error(error)
    })
  }

  calculateAvailable (data: Category | CategoryGroup): number | undefined {
    const category = data as Category
    if (category.budget === undefined || category.spent === undefined) { return undefined }

    return (category.budget - category.spent)
  }

  calculateGroupTotals (group: CategoryGroup, column: string): number | undefined {
    if (!group.categories.length) {
      return undefined
    }

    let numberArray: Array<number> = []
    switch (column) {
      case 'budgeted':
        numberArray = group.categories.map(category => category.budget)
        break
      case 'spent':
        numberArray = group.categories.map(category => category.spent)
        break
      case 'available':
        numberArray = group.categories.map(category => this.calculateAvailable(category) as number)
        break
    }
    return numberArray.reduce((previous, current) => previous + current)
  }

  openAddCategoryDialog (categoryGroupId: number): void {
    const modal = this.modalService.open(AddCategoryDialogComponent)
    modal.componentInstance.setCategoryGroupId(categoryGroupId)
    modal.result.then((category: Category) => {
      const categoryGroup = this.categoryGroups.find(group => group.id === category.categoryGroupId)
      if (categoryGroup) {
        categoryGroup.categories.push(category)
        categoryGroup.categories.sort((a: Category, b: Category) => a.name < b.name ? -1 : 1)
      }
    })
  }

  renameCategory (category: Category) {
    if (this.renameText) {
      this.saveCategory({ ...category, name: this.renameText } as Category)
    }
  }

  updateBudget (event: any, category: Category): void {
    if (event.relatedTarget && event.relatedTarget.name === 'undo-budget-button') return

    if (event.target) {
      const updatedBudget = Number.parseFloat(event.target.value)
      if (updatedBudget || updatedBudget === 0) {
        if (updatedBudget === category.budget) return
        this.saveCategory({ ...category, budget: updatedBudget } as Category)
      }
    }
  }

  saveCategory (category: Category) {
    this.store.dispatch(AppActions.setIsLoading({ isLoading: true }))
    this.categoryDataService.update(category).subscribe(updatedCategory => {
      category = updatedCategory
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
    }, error => {
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
      console.error(error)
    })
  }

  confirmDeleteCategory (category: Category): void {
    const modal = this.modalService.open(DeleteConfirmationModalComponent)
    modal.componentInstance.title = 'Delete Category'
    modal.componentInstance.message = 'Would you like to delete this Category?'
    modal.result.then(result => {
      if (result) {
        this.deleteCategory(category)
      }
    })
  }

  deleteCategory (category: Category): void {
    this.store.dispatch(AppActions.setIsLoading({ isLoading: true }))

    this.categoryDataService.delete(category.id).subscribe(() => {
      const group = this.categoryGroups.find(categoryGroup => categoryGroup.id === category.categoryGroupId)
      if (group) {
        group.categories = group.categories.filter(c => c.id !== category.id)
      }
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
    }, error => {
      this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
      console.error(error)
    })
  }
}
