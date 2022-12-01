<template>
  <div class="flex-column group-row-container">
    <div class="flex-row group-header-row">
      <span class="budget-group-cell budget-column-category editable-cell">
        <button
          type="button"
          @click="isExpanded = !isExpanded"
          class="btn link-light"
        >
          <i
            class="bi"
            :class="{
              'bi-caret-down-fill': isExpanded,
              'bi-caret-right-fill': !isExpanded,
            }"
          ></i>
        </button>
        <input
          :value="group.name"
          v-select-all
          class="form-control margin-bottom-sm editable-cell-input category-name-input me-2"
          :class="{ 'is-invalid': group.isNameInvalid }"
          @blur="rename($event, group)"
          maxlength="100"
        />
        <button
          type="button"
          @click="showAddCategoryDialog(group.id)"
          class="btn btn-primary btn-sm category-hover-action me-2"
          title="Add Category"
        >
          <i class="bi bi-plus-lg me-2"></i>
          <span>Category</span>
        </button>
        <button
          type="button"
          @click="reorderCategoryGroup(group, true)"
          class="btn btn-outline-light btn-sm category-hover-action me-2"
          title="Reorder Down"
          :disabled="group.sortOrder === 1"
        >
          <i class="bi bi-arrow-up"></i>
        </button>
        <button
          type="button"
          @click="reorderCategoryGroup(group, false)"
          class="btn btn-outline-light btn-sm category-hover-action me-2"
          title="Reorder Down"
          :disabled="group.sortOrder === categoryGroups.length"
        >
          <i class="bi bi-arrow-down"></i>
        </button>
      </span>
      <span class="budget-group-cell budget-column-budget">
        <span class="category-hover-action">{{
          toCurrency(group.budgeted)
        }}</span>
      </span>
      <span class="budget-group-cell budget-column-spent">
        <span class="category-hover-action">{{ toCurrency(group.spent) }}</span>
      </span>
      <span class="budget-group-cell budget-column-available">
        <span class="category-hover-action">{{
          toCurrency(group.available)
        }}</span>
      </span>
      <span class="budget-group-cell budget-column-actions">
        <button
          type="button"
          @click="confirmDeleteCategoryGroup(group)"
          class="btn category-hover-action link-danger"
        >
          <i class="bi bi-trash-fill"></i>
        </button>
      </span>
    </div>
    <div v-if="isExpanded">
      <CategoryItem
        v-for="category in group.categories"
        :key="category.id"
        :category="category"
        :categoriesLength="group.categories.length"
      />
    </div>
  </div>

  <CategoryDialog ref="categoryDialog" />
  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef, type Ref } from 'vue'

import type { Category, CategoryGroup } from '@/models'
import { DeleteConfirmation } from '@/components/shared'
import CategoryDialog from './CategoryDialog.vue'
import CategoryItem from './CategoryItem.vue'
import { toCurrency } from '@/helpers/helpers'
import { useCategoryGroupStore, useCategoryStore } from '@/store'

const props = defineProps<{
  group: CategoryGroup
}>()

const categoryGroupStore = useCategoryGroupStore()
const categoryStore = useCategoryStore()

const deleteConfirmationModal = ref()
const categoryDialog = ref()
const isExpanded: Ref<boolean> = ref(true)

const categoryGroups: ComputedRef<Array<CategoryGroup>> = computed(
  () => categoryGroupStore.all
)

const categories: ComputedRef<Array<Category>> = computed(() =>
  categoryStore.all.filter(
    (category) => category.categoryGroupId === props.group.id
  )
)

function rename(event: any, item: CategoryGroup) {
  if (event.target?.value) {
    const updatedName = event.target.value.trim()
    if (updatedName) {
      if (updatedName === item.name) {
        item.isNameInvalid = false
        return
      }
      saveGroup({ ...item, name: updatedName })
      item.isNameInvalid = false
      return
    }
  }
  item.isNameInvalid = true
}

async function saveGroup(group: CategoryGroup) {
  await categoryGroupStore.update(group)
}

function confirmDeleteCategoryGroup(group: CategoryGroup) {
  if (deleteConfirmationModal.value && group) {
    deleteConfirmationModal.value.open(
      deleteCategoryGroup,
      group.id,
      group.name
    )
  }
}

async function deleteCategoryGroup(id: number) {
  await categoryGroupStore.remove(id)
}

async function reorderCategoryGroup(group: CategoryGroup, isUp: boolean) {
  if (
    (isUp && group.sortOrder === 0) ||
    (!isUp &&
      group.sortOrder ===
        categories.value
          .map((cat) => cat.sortOrder)
          .reduce((a: number, b: number) => (a > b ? a : b)))
  ) {
    return
  }
  const newOrder = isUp ? group.sortOrder - 1 : group.sortOrder + 1
  const otherGroup = categoryGroups.value.find(
    (cat) => cat.sortOrder === newOrder
  )
  if (!otherGroup) {
    console.error('Could not find sort order')
    return
  }
  const reorderRequest = {
    item1: {
      id: group.id,
      sortOrder: newOrder,
    },
    item2: {
      id: otherGroup.id,
      sortOrder: group.sortOrder,
    },
  }

  await categoryGroupStore.reorder(reorderRequest)
}

function showAddCategoryDialog(groupId: number) {
  if (categoryDialog.value) {
    categoryDialog.value.open(groupId)
  }
}
</script>

<style scoped>
.budget-group-cell {
  background-color: #212529;
  color: #dee2e6;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  min-height: 48px;
  font-weight: 700;
}
</style>
