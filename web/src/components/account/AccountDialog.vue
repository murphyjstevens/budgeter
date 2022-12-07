<template>
  <Dialog :open="isVisible" @close="reset()" class="relative z-50">
    <div class="fixed inset-0 flex items-center justify-center p-4"></div>
    <DialogPanel class="w-full max-w-sm rounded bg-white">
      <DialogTitle>
        <h5 class="modal-title" id="modalTitle">Add Account</h5>
        <button type="button" class="btn-close"></button>
      </DialogTitle>

      <label for="name" class="form-label">Name</label>
      <input
        id="name"
        v-model="v$.name.$model"
        v-select-all
        type="text"
        class="form-control"
        :class="{ 'is-invalid': v$.name.$error }"
        @blur="v$.name.$touch"
        :pattern="`${accountStore.accountNameRegex}`"
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

      <button type="button" class="rounded-full" @click="isVisible = false">
        Close
      </button>
      <button
        type="button"
        class="rounded-full"
        :disabled="!v$.$dirty || v$.$invalid"
        @click="save()"
      >
        Save
      </button>
    </DialogPanel>
  </Dialog>
</template>

<script setup lang="ts">
import { type Ref, ref, reactive, nextTick } from 'vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { useAccountStore } from '@/store'

const accountStore = useAccountStore()

const isVisible: Ref<boolean> = ref(false)

const state = reactive({
  name: '',
})

const rules = {
  name: { required, $autoDirty: true },
}

const v$ = useVuelidate(rules, state)

defineExpose({
  open,
})

function open() {
  reset()
  isVisible.value = true
}

function reset() {
  state.name = ''
  nextTick(() => {
    v$.value.$reset()
  })
}

async function save() {
  if (v$.value.invalid) {
    return
  }
  await accountStore.create(state.name)
  close()
}
</script>
