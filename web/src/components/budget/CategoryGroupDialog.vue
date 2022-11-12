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
          <h5 class="modal-title" id="modalTitle">Add Category Group</h5>
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
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="v$.name.$model"
                  v-select-all
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
import { nextTick, onMounted, reactive, ref, type Ref } from 'vue'
import { Modal } from 'bootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useCategoryGroupStore } from '@/store'
import type { CategoryGroup } from '@/models'

const categoryGroupStore = useCategoryGroupStore()

const state = reactive({
  name: null as string | null,
})

const rules = {
  name: { required, $autoDirty: true },
}

const v$ = useVuelidate(rules, state)

const modalRef = ref()
const modal: Ref<Modal | null> = ref(null)

defineExpose({
  open,
})

onMounted(() => {
  modal.value = new Modal(modalRef.value)
})

function open() {
  modal.value?.show()
  reset()
}

function close() {
  modal.value?.hide()
}

function reset() {
  state.name = null
  nextTick(() => {
    v$.value.$reset()
  })
}

async function save() {
  if (v$.value.invalid) {
    return
  }
  const group: CategoryGroup = {
    name: state.name,
    sortOrder: categoryGroupStore.all.length + 1,
  } as CategoryGroup
  await categoryGroupStore.create(group)
  close()
}
</script>
