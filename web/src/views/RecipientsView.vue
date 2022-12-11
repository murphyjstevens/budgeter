<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
      <span class="flex flex-row justify-between mb-2">
        <h2 class="text-xl self-end">Recipients</h2>
        <div class="flex flex-row align-center">
          <BButton
            @click="addRow()"
            type="primary-outline"
            icon="plus-lg"
            text="Recipient"
            title="Add Recipient"
          ></BButton>
        </div>
      </span>
      <table class="bg-slate-700">
        <colgroup>
          <col style="width: 100%" />
          <col style="width: 50px" />
        </colgroup>
        <thead class="bg-slate-800">
          <tr>
            <th class="text-left px-3 py-2">Name</th>
            <th class="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-show="isAddingRow" class="h-12 hover:bg-slate-600">
            <td class="px-3 py-2">
              <BInput
                id="name"
                ref="nameAddInput"
                type="text"
                v-model="v$.name.$model"
                name="name"
                @keyup.enter="saveNew()"
                required
              />
              <div
                class="text-red-400 text-sm"
                v-for="error of v$.name.$errors"
                :key="error.$uid"
              >
                <div class="error-msg invalid-feedback d-block">
                  {{ error.$message }}
                </div>
              </div>
            </td>
            <td class="px-3 py-2">
              <div class="icons-container">
                <BButton
                  @click="saveNew()"
                  type="primary-icon-only"
                  icon="check-circle-fill"
                  class="px-2"
                  :disabled="!v$.$dirty || v$.$invalid"
                ></BButton>

                <BButton
                  @click="cancelEditing()"
                  type="default-icon-only"
                  icon="x-circle-fill"
                  class="px-2"
                ></BButton>
              </div>
            </td>
          </tr>
          <tr
            v-for="recipient in recipients"
            :key="recipient.id"
            class="h-12 hover:bg-slate-600"
          >
            <td
              class="px-3 py-2"
              :class="{ 'edit-container': recipient.isEditing }"
            >
              <div v-if="recipient.isEditing">
                <BInput
                  id="name"
                  ref="nameInput"
                  type="text"
                  v-model="v$.name.$model"
                  name="name"
                  @keyup.enter="save(recipient)"
                  required
                ></BInput>
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
              <div v-if="!recipient.isEditing">
                {{ recipient.name }}
              </div>
            </td>
            <td class="px-3 py-2">
              <div class="flex flex-row">
                <BButton
                  v-if="!recipient.isEditing"
                  @click="startEditing(recipient)"
                  type="primary-icon-only"
                  icon="pencil-fill"
                  class="px-2"
                ></BButton>

                <BButton
                  v-if="!recipient.isEditing"
                  @click="confirmDelete(recipient)"
                  type="danger-icon-only"
                  icon="trash-fill"
                  class="px-2"
                ></BButton>

                <BButton
                  v-if="recipient.isEditing"
                  @click="save(recipient)"
                  type="primary-icon-only"
                  icon="check-circle-fill"
                  class="px-2"
                ></BButton>

                <BButton
                  v-if="recipient.isEditing"
                  @click="cancelEditing(recipient)"
                  type="default-icon-only"
                  icon="x-circle-fill"
                  class="px-2"
                ></BButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script setup lang="ts">
import {
  type ComputedRef,
  computed,
  type Ref,
  ref,
  reactive,
  onMounted,
  nextTick,
} from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { BButton, BInput, DeleteConfirmation } from '@/components/shared'
import type { Recipient } from '@/models'
import { useRecipientStore } from '@/store'

const recipientStore = useRecipientStore()

const state = reactive({
  name: null as string | null,
})

const rules = {
  name: { required, $autoDirty: true },
}

const v$ = useVuelidate(rules, state)

const nameInput = ref()
const nameAddInput = ref()
const deleteConfirmationModal = ref()

const isAddingRow: Ref<boolean> = ref(false)

const recipients: ComputedRef<Array<Recipient>> = computed(
  () => recipientStore.all
)

onMounted(() => {
  recipientStore.get()
})

function startEditing(recipient: Recipient) {
  const unsavedRecipient = recipients.value.find((t) => t.isEditing)
  cancelEditing(unsavedRecipient)

  state.name = recipient.name
  v$.value.$reset()
  recipientStore.setRecipientIsEditing({
    ...recipient,
    isEditing: true,
  })

  nextTick(() => {
    nameInput.value.focus()
  })
}

function cancelEditing(recipient: Recipient | null = null) {
  if (recipient) {
    recipientStore.setRecipientIsEditing({
      ...recipient,
      isEditing: false,
    })
  } else {
    isAddingRow.value = false
  }
}

async function save(recipient: Recipient) {
  if (!v$.value.$dirty || v$.value.$invalid) {
    return
  }
  if (state.name) {
    await recipientStore.update({
      ...recipient,
      name: state.name,
    })
  }
}

async function saveNew() {
  if (!v$.value.$dirty || v$.value.$invalid) {
    return
  }
  if (state.name) {
    await recipientStore.create({ name: state.name } as Recipient)
    isAddingRow.value = false
  }
}

function confirmDelete(recipient: Recipient) {
  if (deleteConfirmationModal.value && recipient) {
    deleteConfirmationModal.value.open(deleteRecipient, recipient.id, null)
  }
}

async function deleteRecipient(id: number) {
  await recipientStore.remove(id)
}

function addRow() {
  const unsavedRecipient = recipients.value.find((t) => t.isEditing)
  if (unsavedRecipient) {
    cancelEditing(unsavedRecipient)
  }

  state.name = ''
  v$.value.$reset()
  isAddingRow.value = true

  nextTick(() => {
    nameAddInput.value.focus()
  })
}
</script>
