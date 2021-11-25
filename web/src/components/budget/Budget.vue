<template>
  <div class="flex-column">
    <div class="flex-row justify-content-between mb-1">
      <div class="flex-row align-items-center">
        <button type="button"
                @click="changeMonth(false)"
                class="btn btn-outline-light btn-sm me-2"
                title="Previous Month">
          <i class="bi bi-caret-left-fill"></i>
        </button>
        <h2 class="text-light me-2">{{ selectedDateDisplay }}</h2>
        <button type="button"
                @click="changeMonth(true)"
                class="btn btn-outline-light btn-sm me-2"
                title="Next Month">
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>
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
      <div v-for="group in categoryGroupsCombined"
           :key="group.id"
           class="flex-column group-row-container">
        <div class="flex-row group-header-row">
          <span class="budget-group-cell budget-column-category editable-cell">
            <button type="button" @click="group.isExpanded = !group.isExpanded" class="btn link-light">
              <i class="bi" :class="{ 'bi-caret-down-fill': group.isExpanded, 'bi-caret-right-fill': !group.isExpanded }"></i>
            </button>
            <input :value="group.name" 
                    class="form-control margin-bottom-sm editable-cell-input category-name-input me-2"
                    :class="{ 'is-invalid': group.isNameInvalid }"
                    @blur="rename($event, group, true)"
                    maxlength="100">
            <button type="button"
                    @click="showAddCategoryDialog(group.id)"
                    class="btn btn-primary btn-sm category-hover-action me-2"
                    title="Add Category">
              <i class="bi bi-plus-lg me-2"></i>
              <span>Category</span>
            </button>
            <button type="button"
                    @click="reorderCategoryGroup(group, true)"
                    class="btn btn-outline-light btn-sm category-hover-action me-2"
                    title="Reorder Down"
                    :disabled="group.sortOrder === 1">
              <i class="bi bi-arrow-up"></i>
            </button>
            <button type="button"
                    @click="reorderCategoryGroup(group, false)"
                    class="btn btn-outline-light btn-sm category-hover-action me-2"
                    title="Reorder Down"
                    :disabled="group.sortOrder === categoryGroups.length">
              <i class="bi bi-arrow-down"></i>
            </button>
          </span>
          <span class="budget-group-cell budget-column-budget">{{ $filters.toCurrency(group.budgeted) }}</span>
          <span class="budget-group-cell budget-column-spent">{{ $filters.toCurrency(group.spent) }}</span>
          <span class="budget-group-cell budget-column-available">{{ $filters.toCurrency(group.available) }}</span>
          <span class="budget-group-cell budget-column-actions">
            <button type="button"
                    @click="confirmDeleteCategoryGroup(group)"
                    class="btn category-hover-action link-danger">
              <i class="bi bi-trash-fill"></i>
            </button>
          </span>
        </div>
        <div v-if="group.isExpanded">
          <div v-for="category in group.categories"
               :key="category.id"
               class="flex-row category-row">
            <span class="flex-row budget-category-cell budget-column-category editable-cell">
              <input :value="category.name" 
                     class="form-control margin-bottom-sm editable-cell-input category-name-input me-2"
                     :class="{ 'is-invalid': category.isNameInvalid }"
                     @blur="rename($event, category, false)"
                     maxlength="100">
              <button type="button"
                      @click="reorderCategory(category, true)"
                      class="btn btn-outline-light btn-sm category-hover-action me-2"
                      title="Reorder Down"
                      :disabled="category.sortOrder === 1">
                <i class="bi bi-arrow-up"></i>
              </button>
              <button type="button"
                      @click="reorderCategory(category, false)"
                      class="btn btn-outline-light btn-sm category-hover-action me-2"
                      title="Reorder Down"
                      :disabled="category.sortOrder === group.categories.length">
                <i class="bi bi-arrow-down"></i>
              </button>
            </span>
            <span class="flex-row budget-category-cell budget-column-budget editable-cell">
              <div class="input-group">
                <div class="input-group-prepend">
                  <button class="btn btn-warning" type="button" name="undo-budget-button">
                    <i class="bi bi-arrow-counterclockwise"></i>
                  </button>
                </div>
                <input :value="category.budget"
                      @blur="updateBudget($event, category)" 
                      class="form-control editable-cell-input text-end">
              </div>
            </span>
            <span class="flex-row budget-category-cell budget-column-spent">
              <span>{{ $filters.toCurrency(category.spent) }}</span>
            </span>
            <span class="flex-row budget-category-cell budget-column-available">
              <span>{{ $filters.toCurrency(calculateAvailable(category)) }}</span>
            </span>
            <span class="flex-row budget-category-cell budget-column-actions">
              <button type="button"
                      @click="confirmDeleteCategory(category)"
                      class="btn category-hover-action link-danger">
                <i class="bi bi-trash-fill"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <CategoryDialog ref="categoryDialog" />
  <CategoryGroupDialog ref="categoryGroupDialog" />
  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script>
import { mapState } from 'vuex'
import CategoryDialog from './CategoryDialog.vue'
import CategoryGroupDialog from './CategoryGroupDialog.vue'
import DeleteConfirmation from '../shared/DeleteConfirmation.vue'

export default {
  name: 'Budget',
  components: {
    CategoryDialog,
    CategoryGroupDialog,
    DeleteConfirmation
  },
  computed: {
    ...mapState({
      budgets: state => state.budgets.all,
      categoryGroups: state => state.categoryGroups.all,
      categories: state => state.categories.all,
      selectedDate: state => state.date
    }),
    selectedDateDisplay: function () {
      if (!this.selectedDate) return ''
      const monthName = this.$filters.getMonthString(this.selectedDate.getMonth())
      const year = this.selectedDate.getFullYear()
      return `${monthName} ${year}`
    }
  },
  data () {
    return {
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
          numberArray = categories.map(category => this.calculateAvailable(category))
          break
      }
      return numberArray.reduce((previous, current) => previous + current)
    },

    rename (event, item, isGroup) {
      if (event.target?.value) {
        const updatedName = event.target.value.trim()
        if (updatedName) {
          if (updatedName === item.name) {
            item.isNameInvalid = false
            return
          }
          if (isGroup) {
            this.saveGroup({ ...item, name: updatedName })
          } else {
            this.saveCategory({ ...item, name: updatedName })
          }
          item.isNameInvalid = false
          return
        }
      }
      item.isNameInvalid = true
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

    async saveCategory (category) {
      this.$store.commit('setIsLoading', true)
      try {
        await this.$store.dispatch('categories/update', category)
        this.$store.commit('setIsLoading', false)
      } catch (error) {
        this.$store.commit('setIsLoading', false)
        console.error(error)
      }
    },

    async saveGroup (group) {
      this.$store.commit('setIsLoading', true)
      try {
        await this.$store.dispatch('categoryGroups/update', group)
        this.$store.commit('setIsLoading', false)
      } catch (error) {
        this.$store.commit('setIsLoading', false)
        console.error(error)
      }
    },

    confirmDeleteCategory (category) {
      if (this.$refs.deleteConfirmationModal && category) {
        this.$refs.deleteConfirmationModal.open(this.deleteCategory, category.id, category.name)
      }
    },

    async deleteCategory (id) {
      this.$store.commit('setIsLoading', true)

      try {
        await this.$store.dispatch('categories/delete', id)
        this.$store.commit('setIsLoading', false)
      } catch (error) {
        this.$store.commit('setIsLoading', false)
        console.error(error)
      }
    },

    confirmDeleteCategoryGroup (group) {
      if (this.$refs.deleteConfirmationModal && group) {
        this.$refs.deleteConfirmationModal.open(this.deleteCategoryGroup, group.id, group.name)
      }
    },

    async deleteCategoryGroup (id) {
      this.$store.commit('setIsLoading', true)

      try {
        await this.$store.dispatch('categoryGroups/delete', id)
        this.$store.commit('setIsLoading', false)
      } catch (error) {
        this.$store.commit('setIsLoading', false)
        console.error(error)
      }
    },

    async reorderCategory (category, isUp) {
      this.$store.commit('setIsLoading', true)
      const maxSortOrder =
        this.categories
          .filter(cat => cat.categoryGroupId === category.categoryGroupId)
          .reduce((a, b) => a.sortOrder > b.sortOrder ? a : b)
      if ((isUp && category.sortOrder === 0) ||
        (!isUp && category.sortOrder === maxSortOrder)) {
        this.$store.commit('setIsLoading', false)
        return
      }
      const newOrder = isUp ? category.sortOrder - 1 : category.sortOrder + 1
      const otherCategory = 
        this.categories
          .filter(cat => cat.categoryGroupId === category.categoryGroupId)
          .find(cat => cat.sortOrder === newOrder)
      if (!otherCategory) {
        this.$store.commit('setIsLoading', false)
        console.error('Could not find sort order')
        return
      }
      const reorderRequest = {
        item1: {
          id: category.id,
          sortOrder: newOrder
        },
        item2: {
          id: otherCategory.id,
          sortOrder: category.sortOrder
        }
      }

      try {
        await this.$store.dispatch('categories/reorder', reorderRequest)
        this.$store.commit('setIsLoading', false)
      } catch (error) {
        this.$store.commit('setIsLoading', false)
        console.error(error)
      }
    },

    async reorderCategoryGroup (group, isUp) {
      this.$store.commit('setIsLoading', true)
      if ((isUp && group.sortOrder === 0) ||
        (!isUp && group.sortOrder === this.categories.reduce((a, b) => a.sortOrder > b.sortOrder ? a : b))) {
        this.$store.commit('setIsLoading', false)
        return
      }
      const newOrder = isUp ? group.sortOrder - 1 : group.sortOrder + 1
      const otherGroup = this.categoryGroups.find(cat => cat.sortOrder === newOrder)
      if (!otherGroup) {
        console.error('Could not find sort order')
        this.$store.commit('setIsLoading', false)
        return
      }
      const reorderRequest = {
        item1: {
          id: group.id,
          sortOrder: newOrder
        },
        item2: {
          id: otherGroup.id,
          sortOrder: group.sortOrder
        }
      }

      try {
        await this.$store.dispatch('categoryGroups/reorder', reorderRequest)
        this.$store.commit('setIsLoading', false)
      } catch (error) {
        this.$store.commit('setIsLoading', false)
        console.error(error)
      }
    },

    setCategoryGroupsCombined () {
      if (this.categoryGroups?.length) {
        this.categoryGroupsCombined = this.categoryGroups.map(group => {
          const categories = this.categories.filter(category => category.categoryGroupId === group.id).map(category => ({ ...category }))
          return {
            ...group,
            isExpanded: true,
            categories
          }
        })
      } else {
        this.categoryGroupsCombined = []
      }
    },

    async loadBudgets () {
      await this.$store.dispatch('budgets/get')
    },

    fillBudgets () {
      this.categoryGroupsCombined.forEach(group => {
        group.categories.forEach(category => {
          const categoryBudget = this.budgets.find(budget => budget.categoryId === category.id)
          if (categoryBudget) {
            category.budget = categoryBudget.assigned
            category.spent = categoryBudget.spent
          } else {
            category.budget = 0
            category.spent = 0
          }
        })
        group.budgeted = this.calculateGroupTotals(group, 'budgeted', group.categories),
        group.spent = this.calculateGroupTotals(group, 'spent', group.categories),
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
    },

    showAddCategoryDialog (groupId) {
      if (this.$refs.categoryDialog) {
        this.$refs.categoryDialog.open(groupId)
      }
    }
  },
  mounted () {
    this.$watch(
      () => this.$route.params,
      () => {
        this.$store.commit('initializeDate')
        this.$store.dispatch('categoryGroups/get')
        this.$store.dispatch('categories/get')
      },
      { immediate: true }
    )
  },
  watch: {
    budgets () {
      this.fillBudgets()
    },
    categories () {
      this.setCategoryGroupsCombined()
    },
    categoryGroups () {
      this.setCategoryGroupsCombined()
    },
    selectedDate () {
      this.loadBudgets()
    }
  }
}
</script>

<style scoped lang="scss">
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
    
    .budget-category-cell {
      align-items: center;
      padding: 0 0.75rem;
      background-color: #212529bb;
      color: #dee2e6;
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
