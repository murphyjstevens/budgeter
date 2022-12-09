<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-between mb-1">
      <div class="flex flex-row items-center w-1/3">
        <BButton
          @click="changeMonth(false)"
          icon="caret-left-fill"
          type="default-outline"
          :disabled="!canSelectPreviousMonth"
          title="Previous Month"
        ></BButton>

        <h2 class="text-xl text-center w-36 me-2">
          {{ selectedDateDisplay }}
        </h2>

        <BButton
          @click="changeMonth(true)"
          icon="caret-right-fill"
          type="default-outline"
          :disabled="!canSelectNextMonth"
          title="Next Month"
        ></BButton>
      </div>
      <h2
        class="text-2xl text-center w-1/3"
        :class="{
          'text-green-500': readyToBudget > 0,
          'text-white': !readyToBudget,
          'text-red-500': readyToBudget < 0,
        }"
      >
        {{ toCurrency(readyToBudget) }}
      </h2>
      <div class="text-right w-1/3">
        <BButton
          @click="showAddCategoryGroupDialog()"
          text="Category Group"
          icon="plus-lg"
          type="primary-outline"
          title="Add Category Group"
        ></BButton>
      </div>
    </div>
    <div class="flex flex-col w-full font-bold">
      <div class="flex flex-row bg-slate-800">
        <span class="w-1/2 px-3 py-2">Category</span>
        <span class="w-2/12 text-right px-3 py-2">Budget</span>
        <span class="w-2/12 text-right px-3 py-2">Spent</span>
        <span class="w-2/12 text-right px-3 py-2">Available</span>
        <span class="w-28 px-3 py-2"></span>
      </div>
      <CategoryGroupItem
        v-for="group in categoryGroupsCombined"
        :key="group.id"
        :group="group"
      />
    </div>
  </div>

  <!-- <CategoryGroupDialog ref="categoryGroupDialog" /> -->
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
import BButton from '@/components/shared/BButton.vue'

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
  if (!selectedDate.value) return false
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
      const combinedCategories = categories.value.filter(
        (category: Category) => category.categoryGroupId === group.id
      )

      return {
        ...group,
        isExpanded: true,
        categories: combinedCategories,
        budgeted: calculateGroupTotals(group, 'budgeted', combinedCategories),
        spent: calculateGroupTotals(group, 'spent', combinedCategories),
        available: calculateGroupTotals(group, 'available', combinedCategories),
      }
    })
  } else {
    categoryGroupsCombined.value = []
  }
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

watch(categories, () => {
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
/* .budget-container {
  width: 100%;
}

.budget-header {
  background-color: #212529;
  padding: 0.75rem;
  color: white;
  font-weight: 700;
  border-bottom: 1px solid #dee2e6;
} */
</style>
