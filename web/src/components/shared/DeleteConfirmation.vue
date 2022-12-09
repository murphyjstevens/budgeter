<template>
  <BModal v-model:show="show" type="danger" title="Delete Confirmation">
    <template #dialog-content>
      <div class="flex flex-col">
        <!-- <div class="modal-header">
          <h5 class="modal-title">
            <span>Confirm Delete</span>
            <span v-if="name">: {{ name }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div> -->
        <div class="modal-body">
          <span>Are you sure you would like to delete this item?</span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close()">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="callDelete()">
            Delete
          </button>
        </div>
      </div>
    </template>
  </BModal>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { BModal } from '.'

let id: number | null = null
let deleteCallback: ((id: number) => Promise<void>) | null = null

const show: Ref<boolean> = ref(false)
const name: Ref<string> = ref('')

defineExpose({
  open,
})

function open(
  newDeleteCallback: (id: number) => Promise<void>,
  newId: number,
  newName: string
) {
  deleteCallback = newDeleteCallback
  id = newId
  name.value = newName
  show.value = true
}

function close() {
  show.value = false
}

function callDelete() {
  if (deleteCallback && id) {
    deleteCallback(id)
    close()
  }
}
</script>
