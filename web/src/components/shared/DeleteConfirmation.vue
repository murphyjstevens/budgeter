<template>
  <div class="modal fade" ref="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
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
        </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'

let id: number | null = null
let deleteCallback: ((id: number) => Promise<void>) | null = null

const modalRef = ref()
const modal: Ref<Modal | null> = ref(null)

const name: Ref<string> = ref('')

defineExpose({
  open,
})

onMounted(() => {
  modal.value = new Modal(modalRef.value)
})

function open(
  newDeleteCallback: (id: number) => Promise<void>,
  newId: number,
  newName: string
) {
  modal.value?.show()
  deleteCallback = newDeleteCallback
  id = newId
  name.value = newName
}

function close() {
  modal.value?.hide()
}

function callDelete() {
  if (deleteCallback && id) {
    deleteCallback(id)
    close()
  }
}
</script>
