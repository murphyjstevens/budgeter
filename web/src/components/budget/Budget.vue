<template>
  <div class="flex-column">
    <div class="flex-row justify-content-between mb-1">
      <div class="flex-row align-items-center">
        <button
          type="button"
          @click="changeMonth(false)"
          class="btn btn-outline-light btn-sm me-2"
          :disabled="!canSelectPreviousMonth"
          title="Previous Month"
        >
          <i class="bi bi-caret-left-fill"></i>
        </button>
        <h2 class="text-light text-center me-2" width="145">
          {{ selectedDateDisplay }}
        </h2>
        <button
          type="button"
          @click="changeMonth(true)"
          class="btn btn-outline-light btn-sm me-2"
          :disabled="!canSelectNextMonth"
          title="Next Month"
        >
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>
      <h2
        :class="{
          'text-success': readyToBudget > 0,
          'text-light': !readyToBudget,
          'text-danger': readyToBudget < 0,
        }"
      >
        {{ toCurrency(readyToBudget) }}
      </h2>
      <button
        type="button"
        class="btn btn-primary align-self-center"
        @click="showAddCategoryGroupDialog()"
        title="Add Category Group"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
      >
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
      <CategoryGroupItem
        v-for="group in categoryGroupsCombined"
        :key="group.id"
        :group="group"
      />
    </div>
  </div>

  <CategoryGroupDialog ref="categoryGroupDialog" />
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import {
  datesAreSameMonth,
  getMonthString,
  toCurrency,
} from '@/helpers/helpers'
import CategoryGroupDialog from './CategoryGroupDialog.vue'
import CategoryGroupItem from './CategoryGroupItem.vue'
import type { Budget, Category, CategoryGroup } from '@/models'

const route = useRoute()
const store = useStore()

const categoryGroupDialog = ref()
const categoryGroupsCombined: Ref<Array<CategoryGroup>> = ref([])

const budgets: ComputedRef<Array<Budget>> = computed(
  () => store.state.budgets.all
)
const categoryGroups: ComputedRef<Array<CategoryGroup>> = computed(
  () => store.state.categoryGroups.all
)
const categories: ComputedRef<Array<Category>> = computed(
  () => store.state.categories.all
)
const readyToBudget: ComputedRef<number> = computed(
  () => store.state.budgets.readyToBudget
)
const selectedDate: ComputedRef<Date> = computed(() => store.state.date)

const selectedDateDisplay: ComputedRef<string> = computed(() => {
  if (!selectedDate.value) return ''
  const monthName = getMonthString(selectedDate.value.getMonth())
  const year = selectedDate.value.getFullYear()
  return `${monthName} ${year}`
})

const canSelectNextMonth: ComputedRef<boolean> = computed(() => {
  if (!budgets.value || !selectedDate.value) return false
  return (
    budgets.value.some((budget: any) =>
      datesAreSameMonth(budget.date, selectedDate.value)
    ) || selectedDate.value < new Date()
  )
})

const canSelectPreviousMonth: ComputedRef<boolean> = computed(() => {
  if (!budgets.value || !selectedDate.value) return false
  return (
    budgets.value.some((budget: any) =>
      datesAreSameMonth(budget.date, selectedDate.value)
    ) || selectedDate.value > new Date()
  )
})

function calculateGroupTotals(
  group: CategoryGroup,
  column: string,
  groupCategories: Array<Category>
): number | null {
  const categories = groupCategories ?? group.categories
  if (!categories?.length) {
    return null
  }

  let numberArray: Array<number> = []
  switch (column) {
    case 'budgeted':
      numberArray = categories.map((category) => category.budget)
      break
    case 'spent':
      numberArray = categories.map((category) => category.spent)
      break
    case 'available':
      numberArray = categories.map((category) => category.available)
      break
  }
  return numberArray.reduce((previous, current) => previous + current)
}

function setCategoryGroupsCombined() {
  if (categoryGroups.value?.length) {
    categoryGroupsCombined.value = categoryGroups.value.map((group) => {
      const combinedCategories = categories.value
        .filter((category: Category) => category.categoryGroupId === group.id)
        .map((category: Category) => ({ ...category }))

      return {
        ...group,
        isExpanded: true,
        combinedCategories,
        spent: calculateGroupTotals(group, 'spent', categories.value),
        available: calculateGroupTotals(group, 'available', categories.value),
      }
    })
  } else {
    categoryGroupsCombined.value = []
  }
}

function fillBudgets() {
  categoryGroupsCombined.value.forEach((group: CategoryGroup) => {
    group.categories.forEach((category: Category) => {
      const categoryBudget = budgets.value.find(
        (budget: Budget) => budget.categoryId === category.id
      )
      if (categoryBudget) {
        category.budget = categoryBudget.assigned
      } else {
        category.budget = 0
      }
    })

    group.budgeted = calculateGroupTotals(group, 'budgeted', group.categories)
    group.available = calculateGroupTotals(group, 'available', group.categories)
  })
}

function changeMonth(isIncrement: boolean) {
  store.commit('changeDate', isIncrement)
}

function showAddCategoryGroupDialog() {
  if (categoryGroupDialog.value) {
    categoryGroupDialog.value.open()
  }
}

watch(
  () => route.params,
  () => {
    store.commit('initializeDate')
    store.dispatch('categoryGroups/get')
    store.dispatch('budgets/getReadyToBudget')
  },
  { immediate: true }
)

watch(budgets.value, () => {
  fillBudgets()
})

watch(categories.value, () => {
  store.dispatch('budgets/get')
  setCategoryGroupsCombined()
})

watch(categoryGroups.value, () => {
  setCategoryGroupsCombined()
})

watch(selectedDate.value, () => {
  store.dispatch('categories/get')
})
</script>

<style scoped>
.budget-container {
  width: 100%;
}

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
}

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

.editable-cell .input-group .input-group-prepend {
  display: none;
}

.editable-cell:hover .editable-cell-input,
.editable-cell:focus-within .editable-cell-input {
  border-color: inherit;
}

.editable-cell:focus-within .input-group .input-group-prepend {
  display: flex;
}

.rename-button {
  color: #dee2e6;
}

.rename-button:hover {
  color: dodgerblue;
}
</style>
