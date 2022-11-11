<template>
  <div
    class="modal fade"
    id="exampleModal"
    ref="modalRef"
    tabindex="-1"
    aria-labelledby="modalTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">Add Category</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row gy-3">
              <div class="col-sm-12">
                <label for="category-group" class="form-label"
                  >Category Group</label
                >
                <select
                  id="category-group"
                  v-model="v$.categoryGroupId.$model"
                  name="category-group"
                  class="form-control"
                  @blur="v$.categoryGroupId.$touch"
                  required
                >
                  <option
                    v-for="group in categoryGroups"
                    :key="group.id"
                    :value="group.id"
                  >
                    {{ group.name }}
                  </option>
                </select>
                <div
                  class="input-errors"
                  v-for="error of v$.categoryGroupId.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg invalid-feedback d-block">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="v$.name.$model"
                  type="text"
                  name="name"
                  class="form-control"
                  @blur="v$.name.$touch"
                  required
                />
                <div
                  class="input-errors"
                  v-for="error of v$.name.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg invalid-feedback d-block">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="budget" class="form-label">Budget</label>
                <input
                  id="budget"
                  v-model.number="v$.budget.$model"
                  @blur="blurBudget($event)"
                  @keyup.enter="convertToMoney($event)"
                  name="budget"
                  maxLength="15"
                  class="form-control text-right"
                  required
                />
                <div
                  class="input-errors"
                  v-for="error of v$.budget.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg invalid-feedback d-block">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close()">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!v$.$dirty || v$.$invalid"
            @click="save()"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  type ComputedRef,
  type Ref,
} from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useStore } from 'vuex'
import { Modal } from 'bootstrap'
import type { Category } from '@/models'

const store = useStore()

const state = reactive({
  name: null as string | null,
  budget: null as number | null,
  categoryGroupId: null as number | null,
})

const rules = {
  name: { required, $autoDirty: true },
  budget: { required, $autoDirty: true },
  categoryGroupId: { required, $autoDirty: true },
}

const v$ = useVuelidate(rules, state)

const modalRef = ref()
const modal: Ref<Modal | null> = ref(null)

const categoryGroups: ComputedRef<Array<any>> = computed(
  () => store.state.categoryGroups.all
)

defineExpose({
  open,
})

onMounted(() => {
  modal.value = new Modal(modalRef.value)
})

function open(defaultCategoryGroupId: number) {
  modal.value?.show()
  reset(defaultCategoryGroupId)
}

function close() {
  modal.value?.hide()
}
function reset(defaultCategoryGroupId: number) {
  state.name = null
  state.budget = 0.0
  state.categoryGroupId = defaultCategoryGroupId
  nextTick(() => {
    v$.value.$reset()
  })
}

async function save() {
  if (v$.value.invalid) {
    return
  }

  if (!state.name || !state.categoryGroupId) return

  const groupCategories = store.state.categories.all.filter(
    (category: any) => category.categoryGroupId === state.categoryGroupId
  )
  const category: Category = {
    name: state.name,
    categoryGroupId: state.categoryGroupId,
    sortOrder: groupCategories.length + 1,
    id: 0,
    spent: 0,
    available: 0,
    budget: 0,
  }
  const cat = await store.dispatch('categories/create', category)
  if (cat) {
    if (state.budget && cat) {
      const budget = {
        date: store.state.date,
        assigned: state.budget,
        categoryId: cat.id,
      }
      await store.dispatch('budgets/save', budget)
    }
    close()
  }
}

function convertToMoney(event: any) {
  if (!event.target.value) {
    return
  }

  const budget = Math.round(event.target.value * 100) / 100
  state.budget = budget
}

function blurBudget(event: any) {
  v$.value.budget.$touch()
  convertToMoney(event)
}
</script>
