<template>
  <div class="flex-row category-row">
    <span
      class="flex-row budget-category-cell budget-column-category editable-cell"
    >
      <input
        :value="category.name"
        v-select-all
        class="form-control margin-bottom-sm editable-cell-input category-name-input me-2"
        :class="{ 'is-invalid': isNameInvalid }"
        @blur="rename($event, category)"
        maxlength="100"
      />
      <button
        type="button"
        @click="reorderCategory(category, true)"
        class="btn btn-outline-light btn-sm category-hover-action me-2"
        title="Reorder Down"
        :disabled="category.sortOrder === 1"
      >
        <i class="bi bi-arrow-up"></i>
      </button>
      <button
        type="button"
        @click="reorderCategory(category, false)"
        class="btn btn-outline-light btn-sm category-hover-action me-2"
        title="Reorder Down"
        :disabled="category.sortOrder === categoriesLength"
      >
        <i class="bi bi-arrow-down"></i>
      </button>
    </span>
    <span
      class="flex-row budget-category-cell budget-column-budget editable-cell"
    >
      <div class="input-group">
        <div class="input-group-prepend">
          <button
            class="btn btn-warning"
            type="button"
            name="undo-budget-button"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
        <CurrencyInput
          :value="category.budget"
          v-select-all
          :options="{ currency: 'USD', precision: 2 }"
          @blur="updateBudget($event, category)"
          class="editable-cell-input text-end"
          required
        />
      </div>
    </span>
    <span class="flex-row budget-category-cell budget-column-spent">
      <span>{{ toCurrency(category.spent) }}</span>
    </span>
    <span class="flex-row budget-category-cell budget-column-available">
      <span>{{ toCurrency(category.available) }}</span>
    </span>
    <span class="flex-row budget-category-cell budget-column-actions">
      <button
        type="button"
        @click="confirmDeleteCategory(category)"
        class="btn category-hover-action link-danger"
      >
        <i class="bi bi-trash-fill"></i>
      </button>
    </span>
  </div>

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script setup lang="ts">
import { type ComputedRef, computed, type Ref, ref } from 'vue'
import { CurrencyInput, DeleteConfirmation } from '@/components/shared'
import { toCurrency } from '@/helpers/helpers'
import type { Budget, Category } from '@/models'
import { useBudgetStore, useCategoryStore, useDateStore } from '@/store'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const dateStore = useDateStore()

const deleteConfirmationModal = ref()

const isNameInvalid: Ref<boolean> = ref(false)

const categories: ComputedRef<Array<Category>> = computed(
  () => categoryStore.all
)
const selectedDate: ComputedRef<Date> = computed(() => dateStore.date)

defineProps<{
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
</script>

<style scoped>
.budget-category-cell {
  align-items: center;
  padding: 0 0.75rem;
  background-color: #212529bb;
  color: #dee2e6;
}
</style>
