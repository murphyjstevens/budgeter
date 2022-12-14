<template>
  <div class="flex flex-row group h-14 items-center">
    <span class="flex flex-row w-1/2 px-3 py-2">
      <BInput
        :value="category.name"
        class="bg-inherit ml-6 group-hover:bg-slate-600"
        :class="{ 'is-invalid': isNameInvalid }"
        @blur="rename($event, category)"
        maxlength="100"
      ></BInput>

      <BButton
        @click="reorderCategory(category, true)"
        type="default-outline"
        icon="arrow-up"
        class="hidden group-hover:inline-flex mx-1"
        title="Reorder Down"
        :disabled="category.sortOrder === 1"
      ></BButton>

      <BButton
        @click="reorderCategory(category, false)"
        type="default-outline"
        icon="arrow-down"
        class="hidden group-hover:inline-flex mx-1"
        title="Reorder Down"
        :disabled="category.sortOrder === categoriesLength"
      ></BButton>
    </span>

    <span class="flex flex-row w-2/12 px-3 py-2">
      <div class="input-group">
        <!-- <div class="input-group-prepend">
          <button
            class="btn btn-warning"
            type="button"
            name="undo-budget-button"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
        </div> -->
        <CurrencyInput
          v-model="categoryModel.budget"
          :options="{ currency: 'USD', precision: 2, autoDecimalDigits: true }"
          @blur="updateBudget($event, category)"
          class="bg-inherit group-hover:bg-slate-600"
          required
        />
      </div>
    </span>
    <span class="w-2/12 text-right px-3 py-2">
      {{ toCurrency(category.spent) }}
    </span>
    <span class="w-2/12 text-right px-3 py-2">
      <span
        class="budget-available-wrapper"
        :class="{
          'budget-over': category.available < 0,
          'budget-under': category.available > 0,
        }"
        >{{ toCurrency(category.available) }}</span
      >
    </span>
    <span class="flex flex-row w-28 justify-center px-3 py-2">
      <BButton
        @click="confirmDeleteCategory(category)"
        type="danger-outline"
        icon="trash-fill"
        class="hidden group-hover:inline-flex"
      ></BButton>
    </span>
  </div>

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script setup lang="ts">
import { type ComputedRef, computed, type Ref, ref, watch } from 'vue'

import { toCurrency } from '@/helpers/helpers'
import type { Budget, Category } from '@/models'
import { useBudgetStore, useCategoryStore, useDateStore } from '@/store'
import {
  BButton,
  BInput,
  CurrencyInput,
  DeleteConfirmation,
} from '@/components/shared/'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const dateStore = useDateStore()

const deleteConfirmationModal = ref()

const isNameInvalid: Ref<boolean> = ref(false)
const categoryModel: Ref<Category> = ref({} as Category)

const categories: ComputedRef<Array<Category>> = computed(
  () => categoryStore.all
)
const selectedDate: ComputedRef<Date> = computed(() => dateStore.date)

const props = defineProps<{
  category: Category
  categoriesLength: number
}>()

function rename(event: any, item: Category) {
  if (event.target?.value) {
    const updatedName = event.target.value.trim()
    if (updatedName) {
      if (updatedName === item.name) {
        isNameInvalid.value = false
        return
      }
      saveCategory({ ...item, name: updatedName })
      isNameInvalid.value = false
      return
    }
  }
  isNameInvalid.value = true
}

function updateBudget(event: any, category: Category) {
  if (event.relatedTarget && event.relatedTarget.name === 'undo-budget-button')
    return

  if (event.target) {
    const updatedBudget = Number.parseFloat(event.target.value)
    if (updatedBudget || updatedBudget === 0) {
      if (updatedBudget === category.budget) return
      budgetStore.save({
        assigned: updatedBudget,
        date: selectedDate.value,
        categoryId: category.id,
      } as Budget)
    }
  }
}

async function saveCategory(category: Category) {
  await categoryStore.update(category)
}

function confirmDeleteCategory(category: Category) {
  if (deleteConfirmationModal.value && category) {
    deleteConfirmationModal.value.open(
      deleteCategory,
      category.id,
      category.name
    )
  }
}

async function deleteCategory(id: number) {
  await categoryStore.remove(id)
}

async function reorderCategory(category: Category, isUp: boolean) {
  const maxSortOrder = categories.value
    .filter((cat: Category) => cat.categoryGroupId === category.categoryGroupId)
    .map((cat: Category) => cat.sortOrder)
    .reduce((a: number, b: number) => (a > b ? a : b))
  if (
    (isUp && category.sortOrder === 0) ||
    (!isUp && category.sortOrder === maxSortOrder)
  ) {
    return
  }
  const newOrder = isUp ? category.sortOrder - 1 : category.sortOrder + 1
  const otherCategory = categories.value
    .filter((cat: Category) => cat.categoryGroupId === category.categoryGroupId)
    .find((cat: Category) => cat.sortOrder === newOrder)
  if (!otherCategory) {
    console.error('Could not find sort order')
    return
  }
  const reorderRequest = {
    item1: {
      id: category.id,
      sortOrder: newOrder,
    },
    item2: {
      id: otherCategory.id,
      sortOrder: category.sortOrder,
    },
  }

  await categoryStore.reorder(reorderRequest)
}

watch(
  () => props.category,
  (category) => {
    categoryModel.value = { ...category } as Category
  },
  { immediate: true }
)
</script>

<style scoped>
.budget-category-cell {
  align-items: center;
  padding: 0 0.75rem;
  background-color: #212529bb;
  color: #dee2e6;
}

.editable-cell .input-group .input-group-prepend {
  display: none;
}

.editable-cell:focus-within .input-group .input-group-prepend {
  display: flex;
}
</style>
