<template>
  <div class="flex-column">
    <div class="flex-row justify-content-between mb-1">
      <div class="flex-row align-items-center">
        <button type="button"
                @click="changeMonth(false)"
                class="btn btn-outline-light btn-sm me-2"
                :disabled="!canSelectPreviousMonth"
                title="Previous Month">
          <i class="bi bi-caret-left-fill"></i>
        </button>
        <h2 class="text-light text-center me-2" width="145">{{ selectedDateDisplay }}</h2>
        <button type="button"
                @click="changeMonth(true)"
                class="btn btn-outline-light btn-sm me-2"
                :disabled="!canSelectNextMonth"
                title="Next Month">
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>
      <h2 :class="{ 'text-success': this.readyToBudget > 0, 'text-light': !this.readyToBudget, 'text-danger': this.readyToBudget < 0 }">{{ $filters.toCurrency(readyToBudget) }}</h2>
      <button type="button"
              class="btn btn-primary align-self-center"
              @click="showAddCategoryGroupDialog()"
              title="Add Category Group"
              data-bs-toggle="tooltip"
              data-bs-placement="top">
        <i class="bi bi-plus-lg me-2"></i>
        <span>Category Group</span>
      </button>
    </div>
    <div class="flex-column budget-container">
      <div class="flex-row">
        <span class="budget-header budget-column-category">Category</span>
        <span class="budget-header budget-column-budget">Budget</span>
        <span class="budget-header budget-column-spent">Spent</span>
        <span class="budget-header budget-column-available">Available</span>
        <span class="budget-header budget-column-actions"></span>
      </div>
      <CategoryGroupItem v-for="group in categoryGroupsCombined"
           :key="group.id"
           :group="group" />
    </div>
  </div>

  <CategoryGroupDialog ref="categoryGroupDialog" />
</template>

<script>
import { mapState } from 'vuex'
import CategoryGroupDialog from './CategoryGroupDialog.vue'
import CategoryGroupItem from './CategoryGroupItem.vue'

export default {
  name: 'Budget',
  components: {
    CategoryGroupDialog,
    CategoryGroupItem
  },
  computed: {
    ...mapState({
      budgets: state => state.budgets.all,
      categoryGroups: state => state.categoryGroups.all,
      categories: state => state.categories.all,
      readyToBudget: state => state.budgets.readyToBudget,
      selectedDate: state => state.date
    }),
    selectedDateDisplay () {
      if (!this.selectedDate) return ''
      const monthName = this.$filters.getMonthString(this.selectedDate.getMonth())
      const year = this.selectedDate.getFullYear()
      return `${monthName} ${year}`
    },
    canSelectNextMonth () {
      if (!this.budgets || !this.selectedDate) return false
      return this.budgets.some(budget => this.$filters.datesAreSameMonth(budget.date, this.selectedDate))
        || this.selectedDate < new Date()
    },
    canSelectPreviousMonth () {
      if (!this.budgets || !this.selectedDate) return false
      return this.budgets.some(budget => this.$filters.datesAreSameMonth(budget.date, this.selectedDate))
        || this.selectedDate > new Date()
    }
  },
  data () {
    return {
      categoryGroupsCombined: []
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

    calculateGroupTotals (group, column, groupCategories) {
      const categories = groupCategories ?? group.categories
      if (!categories?.length) {
        return undefined
      }

      let numberArray = []
      switch (column) {
        case 'budgeted':
          numberArray = categories.map(category => category.budget)
          break
        case 'spent':
          numberArray = categories.map(category => category.spent)
          break
        case 'available':
          numberArray = categories.map(category => category.available)
          break
      }
      return numberArray.reduce((previous, current) => previous + current)
    },

    setCategoryGroupsCombined () {
      if (this.categoryGroups?.length) {
        this.categoryGroupsCombined = this.categoryGroups.map(group => {
          const categories = this.categories.filter(category => category.categoryGroupId === group.id).map(category => ({ ...category }))
          return {
            ...group,
            isExpanded: true,
            categories,
            spent: this.calculateGroupTotals(group, 'spent', categories),
            available: this.calculateGroupTotals(group, 'available', categories)
          }
        })
      } else {
        this.categoryGroupsCombined = []
      }
    },

    fillBudgets () {
      this.categoryGroupsCombined.forEach(group => {
        group.categories.forEach(category => {
          const categoryBudget = this.budgets.find(budget => budget.categoryId === category.id)
          if (categoryBudget) {
            category.budget = categoryBudget.assigned
          } else {
            category.budget = 0
          }
        })
        group.budgeted = this.calculateGroupTotals(group, 'budgeted', group.categories),
        group.available = this.calculateGroupTotals(group, 'available', group.categories)
      })
    },

    changeMonth (isIncrement) {
      this.$store.commit('changeDate', isIncrement)
    },

    showAddCategoryGroupDialog () {
      if (this.$refs.categoryGroupDialog) {
        this.$refs.categoryGroupDialog.open()
      }
    }
  },
  mounted () {
    this.$watch(
      () => this.$route.params,
      () => {
        this.$store.commit('initializeDate')
        this.$store.dispatch('categoryGroups/get')
        this.$store.dispatch('budgets/getReadyToBudget')
      },
      { immediate: true }
    )
  },
  watch: {
    budgets () {
      this.fillBudgets()
    },
    categories () {
      this.$store.dispatch('budgets/get')
      this.setCategoryGroupsCombined()
    },
    categoryGroups () {
      this.setCategoryGroupsCombined()
    },
    selectedDate () {
      this.$store.dispatch('categories/get')
    }
  }
}
</script>

<style lang="scss">
  .budget-container {
    width: 100%;

    .budget-header {
      background-color: #212529;
      padding: 0.75rem;
      color: white;
      font-weight: 700;
      border-bottom: 1px solid #dee2e6;
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

    .category-hover-action {
      display: none;
    }
    
    .group-header-row:hover .category-hover-action,
    .category-row:hover .category-hover-action {
      display: inline-flex;
    }

    .budget-group-cell {
      background-color: #212529;
      color: #dee2e6;
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
      min-height: 48px;
      font-weight: 700;
    }

    .editable-cell {
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
    
      .editable-cell-input {
        background-color: transparent;
        color: white;
        border-color: transparent;
        margin-top: 5px;
        margin-bottom: 5px;
      }

      .category-name-input {
        width: 400px;
        max-width: 100%;
      }
    }

    .editable-cell .input-group .input-group-prepend {
      display: none;
    }

    .editable-cell:hover, .editable-cell:focus-within {
      .editable-cell-input {
        border-color: inherit;
      }
    }

    .editable-cell:focus-within .input-group .input-group-prepend {
      display: flex;
    }
  }

  .rename-button {
    color: #dee2e6;
    :hover {
      color: dodgerblue;
    }
  }
</style>
