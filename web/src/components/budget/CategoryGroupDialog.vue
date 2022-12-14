<template>
  <BModal v-model:show="show" title="Add Category Group">
    <template #dialog-content>
      <div class="flex flex-col">
        <div class="flex flex-col p-5">
          <label for="name">Name</label>
          <BInput
            id="name"
            v-model="v$.name.$model"
            type="text"
            name="name"
            required
          />
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
import { nextTick, reactive, ref, type Ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { useCategoryGroupStore } from '@/store'
import type { CategoryGroup } from '@/models'
import { BButton, BInput, BModal } from '@/components/shared'

const categoryGroupStore = useCategoryGroupStore()

const state = reactive({
  name: null as string | null,
})

const rules = {
  name: { required, $autoDirty: true },
}

const v$ = useVuelidate(rules, state)

const show: Ref<boolean> = ref(false)

defineExpose({
  open,
})

function open() {
  show.value = true
  reset()
}

function close() {
  show.value = false
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
