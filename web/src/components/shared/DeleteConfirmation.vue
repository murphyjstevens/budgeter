<template>
  <BModal v-model:show="show" type="danger" title="Delete Confirmation">
    <template #dialog-content>
      <div class="flex flex-col">
        <div class="p-5">
          <span>Are you sure you would like to delete this item?</span>
        </div>
        <div class="flex flex-row justify-end px-4 pb-4">
          <BButton
            @click="close()"
            text="Cancel"
            type="default-outline"
            class="mr-2"
          ></BButton>

          <BButton
            @click="callDelete()"
            text="Delete"
            type="danger"
            icon="trash-fill"
          ></BButton>
        </div>
      </div>
    </template>
  </BModal>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { BButton, BModal } from '.'

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
