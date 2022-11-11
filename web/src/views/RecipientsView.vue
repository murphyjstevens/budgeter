<template>
  <div class="flex-column recipients-container">
    <span class="flex-row justify-content-between">
      <h2 class="text-light">Recipients</h2>
      <div class="flex-row align-items-center">
        <button
          type="button"
          class="btn btn-primary mb-1"
          @click="addRow()"
          title="Add Recipient"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
        >
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
    </span>
    <table class="table table-dark recipient-table">
      <colgroup>
        <col style="width: 100%" />
        <col style="width: 50px" />
      </colgroup>
      <thead class="thead-dark">
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-show="isAddingRow">
          <td class="edit-container">
            <input
              id="name"
              ref="nameAddInput"
              type="text"
              v-model="v$.name.$model"
              v-select-all
              name="name"
              class="form-control form-control-sm"
              @keyup.enter="saveNew()"
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
          </td>
          <td class="icons-cell">
            <div class="icons-container">
              <button
                type="button"
                class="btn link-success"
                @click="saveNew()"
                :disabled="!v$.$dirty || v$.$invalid"
              >
                <i class="bi bi-check-circle-fill"></i>
              </button>
              <button
                type="button"
                class="btn link-secondary"
                @click="cancelEditing()"
              >
                <i class="bi bi-x-circle-fill"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-for="recipient in recipients" :key="recipient.id">
          <td :class="{ 'edit-container': recipient.isEditing }">
            <div v-if="recipient.isEditing">
              <input
                id="name"
                ref="nameInput"
                type="text"
                v-model="v$.name.$model"
                v-select-all
                name="name"
                class="form-control form-control-sm"
                @keyup.enter="save(recipient)"
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
            <div v-if="!recipient.isEditing">
              {{ recipient.name }}
            </div>
          </td>
          <td class="icons-cell">
            <div class="icons-container">
              <button
                v-if="!recipient.isEditing"
                type="button"
                class="btn link-primary"
                @click="startEditing(recipient)"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button
                v-if="!recipient.isEditing"
                type="button"
                class="btn link-danger"
                @click="confirmDelete(recipient)"
              >
                <i class="bi bi-trash-fill"></i>
              </button>
              <button
                v-if="recipient.isEditing"
                type="button"
                class="btn link-success"
                @click="save(recipient)"
                :disabled="!v$.$dirty || v$.$invalid"
              >
                <i class="bi bi-check-circle-fill"></i>
              </button>
              <button
                v-if="recipient.isEditing"
                type="button"
                class="btn link-secondary"
                @click="cancelEditing(recipient)"
              >
                <i class="bi bi-x-circle-fill"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { DeleteConfirmation } from '@/components/shared'
import type { Recipient } from '@/models'

const store = useStore()

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
  () => store.state.recipients.all
)

onMounted(() => {
  store.dispatch('recipients/get')
})

function startEditing(recipient: Recipient) {
  const unsavedRecipient = recipients.value.find((t) => t.isEditing)
  cancelEditing(unsavedRecipient)

  state.name = recipient.name
  v$.value.$reset()
  store.commit('recipients/setRecipientIsEditing', {
    ...recipient,
    isEditing: true,
  })

  nextTick(() => {
    nameInput.value.focus()
  })
}

function cancelEditing(recipient: Recipient | null = null) {
  if (recipient) {
    store.commit('recipients/setRecipientIsEditing', {
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
  await store.dispatch('recipients/update', {
    ...recipient,
    name: name,
  })
}

async function saveNew() {
  if (!v$.value.$dirty || v$.value.$invalid) {
    return
  }
  await store.dispatch('recipients/create', { name: name })
  isAddingRow.value = false
}

function confirmDelete(recipient: Recipient) {
  if (deleteConfirmationModal.value && recipient) {
    deleteConfirmationModal.value.open(deleteRecipient, recipient.id, null)
  }
}

async function deleteRecipient(id: number) {
  await store.dispatch('recipients/delete', id)
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

<style scoped>
.recipient-table tr {
  height: 41px;
}

.recipient-table tr td {
  vertical-align: middle;
}

.recipients-container {
  width: 500px;
  margin: 0 auto;
}

.edit-container {
  padding: 0;
}
</style>
