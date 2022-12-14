<template>
  <BModal v-model:show="show" title="Add Account">
    <template #dialog-content>
      <div class="flex flex-col">
        <div class="flex flex-col p-5">
          <label for="name">Name</label>
          <BInput
            id="name"
            v-model="v$.name.$model"
            type="text"
            :pattern="`${accountStore.accountNameRegex}`"
            required
          ></BInput>
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.name.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </div>
        </div>

        <div class="flex flex-row justify-end px-4 pb-4">
          <BButton
            @click="close()"
            text="Cancel"
            type="default-outline"
            class="mr-2"
          ></BButton>

          <BButton
            @click="save()"
            text="Save"
            type="primary"
            icon="save-fill"
            :disabled="!v$.$dirty || v$.$invalid"
          ></BButton>
        </div>
      </div>
    </template>
  </BModal>
</template>

<script setup lang="ts">
import { type Ref, ref, reactive, nextTick } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { BButton, BInput, BModal } from '@/components/shared'
import { useAccountStore } from '@/store'

const accountStore = useAccountStore()

const show: Ref<boolean> = ref(false)

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
  show.value = true
}

function close() {
  show.value = false
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
