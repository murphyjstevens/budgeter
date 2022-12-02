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

import {
  datesAreSameMonth,
  getMonthString,
  toCurrency,
} from '@/helpers/helpers'
import CategoryGroupDialog from '../components/budget/CategoryGroupDialog.vue'
import CategoryGroupItem from '../components/budget/CategoryGroupItem.vue'
import type { Budget, Category, CategoryGroup } from '@/models'
import {
  useBudgetStore,
  useCategoryGroupStore,
  useCategoryStore,
  useDateStore,
} from '@/store'

const route = useRoute()
const budgetStore = useBudgetStore()
const categoryGroupStore = useCategoryGroupStore()
const categoryStore = useCategoryStore()
const dateStore = useDateStore()

const categoryGroupDialog = ref()
const categoryGroupsCombined: Ref<Array<CategoryGroup>> = ref([])

const budgets: ComputedRef<Array<Budget>> = computed(() => budgetStore.all)
const categoryGroups: ComputedRef<Array<CategoryGroup>> = computed(
  () => categoryGroupStore.all
)
const categories: ComputedRef<Array<Category>> = computed(
  () => categoryStore.all
)
const readyToBudget: ComputedRef<number> = computed(
  () => budgetStore.readyToBudget
)
const selectedDate: ComputedRef<Date> = computed(() => dateStore.date)

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
  return budgetStore.hasPreviousMonthBudget || selectedDate.value > new Date()
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
        categories: combinedCategories,
        budgeted: calculateGroupTotals(group, 'budgeted', categories.value),
        spent: calculateGroupTotals(group, 'spent', categories.value),
        available: calculateGroupTotals(group, 'available', categories.value),
      }
    })
  } else {
    categoryGroupsCombined.value = []
  }
}

function fillBudgets() {
  categoryGroupsCombined.value = [
    ...categoryGroupsCombined.value.map((group: CategoryGroup) => {
      // Categories need to be mapped first to get budgeted totals
      group.categories = group.categories.map((category: Category) => {
        const categoryBudget = budgets.value.find(
          (budget: Budget) => budget.categoryId === category.id
        )

        return {
          ...category,
          budget: categoryBudget?.assigned ?? 0,
        }
      })
      return {
        ...group,
        budgeted: calculateGroupTotals(group, 'budgeted', group.categories),
        spent: calculateGroupTotals(group, 'spent', group.categories),
        available: calculateGroupTotals(group, 'available', group.categories),
      }
    }),
  ]
}

function changeMonth(isIncrement: boolean) {
  dateStore.changeDate(isIncrement)
}

function showAddCategoryGroupDialog() {
  if (categoryGroupDialog.value) {
    categoryGroupDialog.value.open()
  }
}

watch(
  () => route.params,
  () => {
    categoryGroupStore.get()
    budgetStore.getReadyToBudget()
  },
  { immediate: true }
)

watch(budgets, () => {
  fillBudgets()
})

watch(categories, () => {
  budgetStore.get()
  setCategoryGroupsCombined()
})

watch(categoryGroups, () => {
  setCategoryGroupsCombined()
})

watch(
  selectedDate,
  () => {
    budgetStore.getHasPreviousMonthBudget()
    categoryStore.get()
  },
  { immediate: true }
)
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
</style>
