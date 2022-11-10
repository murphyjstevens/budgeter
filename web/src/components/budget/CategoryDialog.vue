<template>
  <div class="modal fade" id="exampleModal" ref="modal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">Add Category</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row gy-3">
              <div class="col-sm-12">
                <label for="category-group" class="form-label">Category Group</label>
                <select id="category-group"
                        v-model="categoryGroupId"
                        name="category-group"
                        class="form-control"
                        @blur="v$.categoryGroupId.$touch"
                        required>
                  <option v-for="group in categoryGroups" 
                          :key="group.id"
                          :value="group.id">{{ group.name }}</option>
                </select>
                <div class="input-errors" v-for="error of v$.categoryGroupId.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="name" class="form-label">Name</label>
                <input id="name"
                       v-model="name"
                       type="text"
                       name="name"
                       class="form-control"
                       @blur="v$.name.$touch"
                       required>
                <div class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="budget" class="form-label">Budget</label>
                <input id="budget"
                       v-model.number="budget"
                       @blur="blurBudget($event)"
                       @keyup.enter="convertToMoney($event)"
                       name="budget"
                       maxLength="15"
                       class="form-control text-right"
                       required>
                <div class="input-errors" v-for="error of v$.budget.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button"
            class="btn btn-secondary"
            @click="close()">Close</button>
          <button type="button"
            class="btn btn-primary"
            :disabled="!v$.$dirty || v$.$invalid"
            @click="save()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Modal } from 'bootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { mapState } from 'vuex'

export default {
  name: 'CategoryDialog',
  computed: {
    ...mapState({
      categoryGroups: state => state.categoryGroups.all
    })
  },
  data () {
    return {
      modal: undefined,
      name: undefined,
      budget: undefined,
      categoryGroupId: undefined
    }
  },
  methods: {
    open (defaultCategoryGroupId) {
      this.modal.show()
      this.reset(defaultCategoryGroupId)
    },
    close () {
      this.modal.hide()
    },
    reset (defaultCategoryGroupId) {
      this.name = null
      this.budget = 0.00
      this.categoryGroupId = defaultCategoryGroupId
      this.$nextTick(() => {
        this.v$.$reset()
      })
    },
    async save () {
      if (this.v$.invalid) {
        return
      }
      const groupCategories = this.$store.state.categories.all.filter(category => category.categoryGroupId === this.categoryGroupId)
      const category = {
        name: this.name,
        categoryGroupId: this.categoryGroupId,
        sortOrder: groupCategories.length + 1
      }
      const cat = await this.$store.dispatch('categories/create', category)
      if (cat) {
        if (this.budget && cat) {
          const budget = {
            date: this.$store.state.date,
            assigned: this.budget,
            categoryId: cat.id
          }
          await this.$store.dispatch('budgets/save', budget)
        }
        this.close()
      }
    },
    convertToMoney (event) {
      if (!event.target.value) { return }

      const budget = Math.round(event.target.value * 100) / 100
      this.budget = budget
    },
    blurBudget (event) {
      this.v$.budget.$touch()
      this.convertToMoney(event)
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {})
  },
  setup () {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      name: { required },
      budget: { required },
      categoryGroupId: { required }
    }
  }
}
</script>
