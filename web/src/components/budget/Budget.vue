<template>
  <div class="flex-column">
    <h1>{{ month }}</h1>
    <div class="flex-column budget-container">
      <div class="flex-row">
        <span class="budget-header budget-column-category">Category</span>
        <span class="budget-header budget-column-budget">Budget</span>
        <span class="budget-header budget-column-spent">Spent</span>
        <span class="budget-header budget-column-available">Available</span>
        <span class="budget-header budget-column-actions"></span>
      </div>
      <div v-for="group in categoryGroupsCombined"
           :key="group.id"
           class="flex-column group-row-container">
        <div class="flex-row group-header-row">
          <span class="budget-group-cell budget-column-category">
            <button type="button" @click="group.isExpanded = !group.isExpanded" class="btn btn-icon-only">
              <i class="bi" :class="{ 'bi-caret-down-fill': group.isExpanded, 'bi-caret-right-fill': !group.isExpanded }"></i>
            </button>
            {{ group.name }}
            <button type="button"
                    @click="openAddCategoryDialog(group.id)"
                    class="btn btn-primary btn-sm add-category-button">
              <i class="bi bi-plus-lg margin-right-sm"></i>
              <span>Add Category</span>
            </button>
          </span>
          <span class="budget-group-cell budget-column-budget">{{ $filters.toCurrency(calculateGroupTotals(group, 'budgeted')) }}</span>
          <span class="budget-group-cell budget-column-spent">{{ $filters.toCurrency(calculateGroupTotals(group, 'spent')) }}</span>
          <span class="budget-group-cell budget-column-available">{{ $filters.toCurrency(calculateGroupTotals(group, 'available')) }}</span>
          <span class="budget-group-cell budget-column-actions"></span>
        </div>
        <div v-if="group.isExpanded">
          <div v-for="category in group.categories"
               :key="category.id"
               class="flex-row">
            <span class="budget-category-cell budget-column-category">
              <!-- <div id="renameModal">
                <div class="flex-column">
                  <input v-model="renameText" class="form-control margin-bottom-sm">
                  <button type="button"
                          class="btn btn-primary btn-sm flex-align-self-end"
                          @click="renameCategory(category)">Save</button>
                </div>
              </div>
              
              <button type="button" [ngbPopover]="categoryRenamePopover" popoverTitle="Rename" [autoClose]="'outside'" class="btn-no-style rename-button">
                {{category.name}}
              </button> -->
            </span>
            <span class="budget-category-cell budget-column-budget editable-cell">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <button class="btn btn-outline-danger" type="button" name="undo-budget-button">
                    <i class="bi bi-arrow-counterclockwise"></i>
                  </button>
                </div>
                <input v-model="category.budget" 
                      pattern="^d+((.|,)d{2})?$" 
                      @blur="updateBudget($event, category)" 
                      currencyFormatter 
                      class="form-control editable-cell-input">
              </div>
            </span>
            <span class="budget-category-cell budget-column-spent">
              <span>{{ $filters.toCurrency(category.spent) }}</span>
            </span>
            <span class="budget-category-cell budget-column-available">
              <span>{{ $filters.toCurrency(calculateAvailable(category)) }}</span>
            </span>
            <span class="budget-category-cell budget-column-actions">
              <button type="button"
                      @click="confirmDeleteCategory(category)"
                      class="btn-icon-only">
                <i class="bi bi-trash-fill"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Budget',
  computed: {
    ...mapState({
      categoryGroups: state => state.categoryGroups.all,
      categories: state => state.categories.all
    })
  },
  data () {
    return {
      month: 'January',
      categoryGroupsCombined: [],
      isEditingRow: false,
      renameText: ''
    }
  },
  methods: {
    calculateAvailable (category) {
      if (category.budget === undefined
          || category.budget === null
          || category.spent === undefined
          || category.spent === null) { return undefined }

      return (category.budget - category.spent)
    },

    calculateGroupTotals (group, column) {
      if (!group.categories.length) {
        return undefined
      }

      let numberArray = []
      switch (column) {
        case 'budgeted':
          numberArray = group.categories.map(category => category.budget)
          break
        case 'spent':
          numberArray = group.categories.map(category => category.spent)
          break
        case 'available':
          numberArray = group.categories.map(category => this.calculateAvailable(category))
          break
      }
      return numberArray.reduce((previous, current) => previous + current)
    },

    renameCategory (category) {
      return category
      // if (this.renameText) {
      //   this.saveCategory({ ...category, name: this.renameText } as Category)
      // }
    },
    updateBudget (event, category) {
      if (event.relatedTarget && event.relatedTarget.name === 'undo-budget-button') return

      if (event.target) {
        const updatedBudget = Number.parseFloat(event.target.value)
        if (updatedBudget || updatedBudget === 0) {
          if (updatedBudget === category.budget) return
          this.saveCategory({ ...category, budget: updatedBudget })
        }
      }
    },

    saveCategory (category) {
      // this.store.dispatch(AppActions.setIsLoading({ isLoading: true }))
      this.categoryDataService.update(category).subscribe(updatedCategory => {
        category = updatedCategory
        // this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
      }, error => {
        // this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
        console.error(error)
      })
    },

    confirmDeleteCategory (category) {
      return category
      // const modal = this.modalService.open(DeleteConfirmationModalComponent)
      // modal.componentInstance.title = 'Delete Category'
      // modal.componentInstance.message = 'Would you like to delete this Category?'
      // modal.result.then(result => {
      //   if (result) {
      //     this.deleteCategory(category)
      //   }
      // })
    },

    deleteCategory (category) {
      // this.store.dispatch(AppActions.setIsLoading({ isLoading: true }))

      this.categoryDataService.delete(category.id).subscribe(() => {
        const group = this.categoryGroups.find(categoryGroup => categoryGroup.id === category.categoryGroupId)
        if (group) {
          group.categories = group.categories.filter(c => c.id !== category.id)
        }
        // this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
      }, error => {
        // this.store.dispatch(AppActions.setIsLoading({ isLoading: false }))
        console.error(error)
      })
    },

    setCategoryGroupsCombined () {
      if (this.categoryGroups?.length && this.categories?.length) {
        this.categoryGroupsCombined = [...this.categoryGroups.map(group => {
          return { ...group, categories: this.categories.filter(category => category.categoryGroupId === group.id) }
        })]
      } else {
        this.categoryGroupsCombined = []
      }
    }
  },
  mounted () {
    this.$watch(
      () => this.$route.params,
      () => {
        this.$store.dispatch('categoryGroups/get')
        this.$store.dispatch('categories/get')
      },
      { immediate: true }
    )
  },
  watch: {
    categories () {
      this.setCategoryGroupsCombined()
    },
    categoryGroups () {
      this.setCategoryGroupsCombined()
    }
  }
}
</script>

<style scoped lang="scss">
  .budget-container {
    width: 100%;
    border: 1px solid #dee2e6;

    .budget-header {
      background-color: #343a40;
      padding: 0.75rem;
      color: white;
      font-weight: 700;
    }

    .budget-category-money {
      width: 10%;
      text-align: right;
      margin-left: 1em;
    }
    
    .budget-column-category {
      width: 55%;
    }
    
    .budget-column-budget {
      width: 15%;
      text-align: right;
      justify-content: flex-end;
    }
    
    .budget-column-spent {
      width: 15%;
      text-align: right;
      justify-content: flex-end;
    }
    
    .budget-column-available {
      width: 15%;
      text-align: right;
      justify-content: flex-end;
    }
    
    .budget-column-actions {
      width: 100px;
      text-align: center;
      justify-content: center;
    }

    .add-category-button {
      color: white;
      margin-left: 5px;
      display: none;
    }
    
    .group-header-row:hover .add-category-button {
      display: inline-flex;
    }

    .budget-group-cell {
      background-color: whitesmoke;
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
      min-height: 48px;
      font-weight: 700;
    }
    
    .budget-category-cell {
      padding: 0.75rem;
    }

    .editable-cell {
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
    
      .editable-cell-input {
        text-align: right;
        border-width: 0;
      }
    }

    .editable-cell .input-group .input-group-prepend {
      display: none;
    }

    .editable-cell:hover, .editable-cell:focus-within {
      .editable-cell-input {
        border-width: 1px;
      }
    }

    .editable-cell:focus-within .input-group .input-group-prepend {
      display: flex;
    }

    .rename-button:hover {
      color: dodgerblue
    }
  }
</style>
