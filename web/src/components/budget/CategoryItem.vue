<template>
  <div class="flex-row category-row">
    <span class="flex-row budget-category-cell budget-column-category editable-cell">
      <input :value="category.name"
             v-select-all
             class="form-control margin-bottom-sm editable-cell-input category-name-input me-2"
             :class="{ 'is-invalid': category.isNameInvalid }"
             @blur="rename($event, category)"
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
              :disabled="category.sortOrder === categoriesLength">
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
        <CurrencyInput :value="category.budget"
                       v-select-all
                       :options="{ currency: 'USD', precision: 2 }"
                       @blur="updateBudget($event, category)"
                       class="editable-cell-input text-end"
                       required/>
      </div>
    </span>
    <span class="flex-row budget-category-cell budget-column-spent">
      <span>{{ $filters.toCurrency(category.spent) }}</span>
    </span>
    <span class="flex-row budget-category-cell budget-column-available">
      <span>{{ $filters.toCurrency(category.available) }}</span>
    </span>
    <span class="flex-row budget-category-cell budget-column-actions">
      <button type="button"
              @click="confirmDeleteCategory(category)"
              class="btn category-hover-action link-danger">
        <i class="bi bi-trash-fill"></i>
      </button>
    </span>
  </div>

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script lang="ts">
import { mapState } from 'vuex'
import { CurrencyInput, DeleteConfirmation } from '../shared'

export default {
  name: 'CategoryItem',
  components: {
    CurrencyInput,
    DeleteConfirmation
  },
  computed: {
    ...mapState({
      categories: state => state.categories.all,
      selectedDate: state => state.date
    })
  },
  data () {
    return {
      isExpanded: true
    }
  },
  methods: {
    rename (event, item) {
      if (event.target?.value) {
        const updatedName = event.target.value.trim()
        if (updatedName) {
          if (updatedName === item.name) {
            item.isNameInvalid = false
            return
          }
          this.saveCategory({ ...item, name: updatedName })
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
          this.$store.dispatch('budgets/save', { assigned: updatedBudget, date: this.selectedDate, categoryId: category.id })
        }
      }
    },

    async saveCategory (category) {
      await this.$store.dispatch('categories/update', category)
    },

    confirmDeleteCategory (category) {
      if (this.$refs.deleteConfirmationModal && category) {
        this.$refs.deleteConfirmationModal.open(this.deleteCategory, category.id, category.name)
      }
    },

    async deleteCategory (id) {
      await this.$store.dispatch('categories/delete', id)
    },

    async reorderCategory (category, isUp) {
      const maxSortOrder =
        this.categories
          .filter(cat => cat.categoryGroupId === category.categoryGroupId)
          .reduce((a, b) => a.sortOrder > b.sortOrder ? a : b)
      if ((isUp && category.sortOrder === 0) ||
        (!isUp && category.sortOrder === maxSortOrder)) {
        return
      }
      const newOrder = isUp ? category.sortOrder - 1 : category.sortOrder + 1
      const otherCategory = 
        this.categories
          .filter(cat => cat.categoryGroupId === category.categoryGroupId)
          .find(cat => cat.sortOrder === newOrder)
      if (!otherCategory) {
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

      await this.$store.dispatch('categories/reorder', reorderRequest)
    }
  },
  props: ['category', 'categoriesLength']
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
