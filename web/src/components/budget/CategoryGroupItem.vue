<template>
  <div class="flex-column group-row-container">
    <div class="flex-row group-header-row">
      <span class="budget-group-cell budget-column-category editable-cell">
        <button type="button" @click="isExpanded = !isExpanded" class="btn link-light">
          <i class="bi" :class="{ 'bi-caret-down-fill': isExpanded, 'bi-caret-right-fill': !isExpanded }"></i>
        </button>
        <input :value="group.name" 
               v-select-all
               class="form-control margin-bottom-sm editable-cell-input category-name-input me-2"
               :class="{ 'is-invalid': group.isNameInvalid }"
               @blur="rename($event, group)"
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
    <div v-if="isExpanded">
      <CategoryItem v-for="category in group.categories"
            :key="category.id"
            :category="category"
            :categoriesLength="group.categories.length" />
    </div>
  </div>

  <CategoryDialog ref="categoryDialog" />
  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script>
import { mapState } from 'vuex'
import { DeleteConfirmation } from '../shared'
import CategoryDialog from './CategoryDialog.vue'
import CategoryItem from './CategoryItem.vue'

export default {
  name: 'CategoryGroupItem',
  components: {
    CategoryDialog,
    CategoryItem,
    DeleteConfirmation
  },
  computed: {
    ...mapState({
      budgets: state => state.budgets.all,
      categoryGroups: state => state.categoryGroups.all,
      categories: state => state.categories.all
    })
  },
  data () {
    return {
      isExpanded: true
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

    rename (event, item) {
      if (event.target?.value) {
        const updatedName = event.target.value.trim()
        if (updatedName) {
          if (updatedName === item.name) {
            item.isNameInvalid = false
            return
          }
          this.saveGroup({ ...item, name: updatedName })
          item.isNameInvalid = false
          return
        }
      }
      item.isNameInvalid = true
    },

    async saveGroup (group) {
      await this.$store.dispatch('categoryGroups/update', group)
    },

    confirmDeleteCategoryGroup (group) {
      if (this.$refs.deleteConfirmationModal && group) {
        this.$refs.deleteConfirmationModal.open(this.deleteCategoryGroup, group.id, group.name)
      }
    },

    async deleteCategoryGroup (id) {
      await this.$store.dispatch('categoryGroups/delete', id)
    },

    async reorderCategoryGroup (group, isUp) {
      if ((isUp && group.sortOrder === 0) ||
        (!isUp && group.sortOrder === this.categories.reduce((a, b) => a.sortOrder > b.sortOrder ? a : b))) {
        return
      }
      const newOrder = isUp ? group.sortOrder - 1 : group.sortOrder + 1
      const otherGroup = this.categoryGroups.find(cat => cat.sortOrder === newOrder)
      if (!otherGroup) {
        console.error('Could not find sort order')
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

      await this.$store.dispatch('categoryGroups/reorder', reorderRequest)
    },

    showAddCategoryDialog (groupId) {
      if (this.$refs.categoryDialog) {
        this.$refs.categoryDialog.open(groupId)
      }
    }
  },
  props: ['group']
}
</script>

<style lang="scss">
</style>
