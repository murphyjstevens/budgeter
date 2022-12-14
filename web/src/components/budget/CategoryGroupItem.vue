<template>
  <div class="flex flex-col bg-slate-800">
    <div
      class="flex flex-row group h-14 bg-slate-700 border-b-2 border-white items-center"
    >
      <span class="flex flex-row w-1/2 px-3 py-2">
        <button type="button" @click="isExpanded = !isExpanded" class="mr-2">
          <i
            class="bi"
            :class="{
              'bi-caret-down-fill': isExpanded,
              'bi-caret-right-fill': !isExpanded,
            }"
          ></i>
        </button>
        <BInput
          :value="group.name"
          class="bg-inherit group-hover:bg-slate-600 mr-2"
          backgroundType="none"
          @blur="rename($event, group)"
          maxlength="100"
        ></BInput>

        <BButton
          @click="showAddCategoryDialog(group.id)"
          type="primary-outline"
          text="Category"
          icon="plus-lg"
          title="Add Category"
          class="hidden group-hover:inline-flex mr-1"
        ></BButton>

        <BButton
          @click="reorderCategoryGroup(group, true)"
          type="default-outline"
          icon="arrow-up"
          class="hidden group-hover:inline-flex mr-1"
          title="Reorder Down"
          :disabled="group.sortOrder === 1"
        ></BButton>

        <BButton
          @click="reorderCategoryGroup(group, false)"
          type="default-outline"
          icon="arrow-down"
          class="hidden group-hover:inline-flex mr-1"
          title="Reorder Down"
          :disabled="group.sortOrder === categoryGroups.length"
        ></BButton>
      </span>
      <span class="w-2/12 text-right px-3 py-2">
        {{ toCurrency(group.budgeted) }}
      </span>
      <span class="w-2/12 text-right px-3 py-2">
        {{ toCurrency(group.spent) }}
      </span>
      <span class="w-2/12 text-right px-3 py-2">
        {{ toCurrency(group.available) }}
      </span>
      <span class="flex flex-row w-28 justify-center px-3 py-2">
        <BButton
          @click="confirmDeleteCategoryGroup(group)"
          type="danger-outline"
          icon="trash-fill"
          class="hidden group-hover:inline-flex"
        ></BButton>
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
import BButton from '../shared/BButton.vue'
import BInput from '../shared/BInput.vue'

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
