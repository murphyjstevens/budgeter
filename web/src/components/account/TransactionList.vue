<template>
  <table class="table table-dark">
    <colgroup>
      <col style="width: 15%; min-width: 175px;">
      <col v-if="!account" style="width: 20%">
      <col style="width: 25%">
      <col style="width: 20%">
      <col style="width: 15%; min-width: 110px;">
      <col style="width: 25%">
      <col style="width: 50px">
    </colgroup>
    <thead class="thead-dark">
      <tr>
        <th>Date</th>
        <th v-if="!account">Account</th>
        <th>Recipient</th>
        <th>Category</th>
        <th class="text-align-right">Cost</th>
        <th>Tags</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in transactions"
          :key="transaction.id">
        <td>
          <div v-if="transaction.isEditing">
            <input class="form-control"
                    type="date"
                    name="date"
                    v-model="editTransaction.date"
                    placeholder="yyyy/MM/dd"
                    required />
          </div>
          <div v-if="!transaction.isEditing">
            {{ toShortDate(new Date(transaction.date))}}
          </div>
        </td>
        <td v-if="!account">
          <div v-if="transaction.isEditing">
            <select id="account"
                    v-model="editTransaction.accountId"
                    name="account"
                    class="form-select"
                    required>
              <option v-for="acc in accounts"
                      :key="acc.id"
                      :value="acc.id">{{ acc.name }}</option>
            </select>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getAccountName(transaction.accountId) }}
          </div>
        </td>
        <td>
          <div v-if="transaction.isEditing">
            <select id="recipient"
                    v-model="editTransaction.recipientId"
                    name="recipient"
                    class="form-select"
                    required>
              <option v-for="rec in recipients"
                      :key="rec.id"
                      :value="rec.id">{{ rec.name }}</option>
            </select>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getRecipientName(transaction.recipientId) }}
          </div>
        </td>
        <td>
          <div v-if="transaction.isEditing">
            <select id="category"
                    v-model="editTransaction.categoryId"
                    name="category"
                    class="form-select"
                    required>
              <option v-for="category in categories"
                      :key="category.id" 
                      :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getCategoryName(transaction.categoryId) }}
          </div>
        </td>
        <td>
          <div v-if="transaction.isEditing">
            <CurrencyInput v-model="editTransaction.cost"
                           v-select-all
                           name="cost"
                           :options="{ currency: 'USD', precision: 2 }"
                           class="text-end"
                           required/>
          </div>
          <div v-if="!transaction.isEditing" class="text-end">
            {{ toCurrency(transaction.cost) }}
          </div>
        </td>
        <td>
        </td>
        <td class="icons-cell">
          <div class="icons-container">
            <button v-if="!transaction.isEditing" 
                    type="button" 
                    class="btn link-primary" 
                    @click="startEditing(transaction)">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button v-if="!transaction.isEditing" 
                    type="button" 
                    class="btn link-danger"
                    @click="confirmDelete(transaction)">
              <i class="bi bi-trash-fill"></i>
            </button>
            <button v-if="transaction.isEditing" 
                    type="button" 
                    class="btn link-success" 
                    @click="save(editTransaction)">
              <i class="bi bi-check-circle-fill"></i>
            </button>
            <button v-if="transaction.isEditing" 
                    type="button" 
                    class="btn link-secondary" 
                    @click="cancelEditing(transaction)">
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script setup lang="ts">
import { type ComputedRef, computed, ref, type Ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useStore } from 'vuex'

import { toCurrency, toShortDate } from '@/helpers/helpers';
import { CurrencyInput, DeleteConfirmation } from '@/components/shared'

const route = useRoute()
const store = useStore()

const deleteConfirmationModal = ref()

const editTransaction: Ref<any | null> = ref(null)
const accountUrl: Ref<string | null> = ref(null)

const account: ComputedRef<any> = computed(() => store.state.accounts.account)
const accounts: ComputedRef<Array<any>> = computed(() => store.state.accounts.all)
const categories: ComputedRef<Array<any>> = computed(() => store.state.categories.all)
const recipients: ComputedRef<Array<any>> = computed(() => store.state.recipients.all)
const transactions: ComputedRef<Array<any>> = computed(() => store.state.transactions.all)

function getCategoryName(id: number) {
  const category = categories.value.find(c => c.id === id)
  return category ? category.name : 'Ready to Budget'
}

function getAccountName (id: number) {
  const account = accounts.value?.find(a => a.id === id)
  return account ? account.name : ''
}

function getRecipientName (id: number) {
  const recipient = recipients.value?.find(r => r.id === id)
  return recipient ? recipient.name : ''
}

function startEditing (transaction: any) {
  const unsavedTransaction = transactions.value.find(t => t.isEditing)
  if (unsavedTransaction) {
    cancelEditing(unsavedTransaction)
  }
  const dateString = toShortDate(new Date(transaction.date), 'yyyy-MM-dd')
  editTransaction.value = { ...transaction, date: dateString }
  store.commit('transactions/setTransactionIsEditing', { ...transaction, isEditing: true })
}

function cancelEditing (transaction: any) {
  store.commit('transactions/setTransactionIsEditing', { ...transaction, isEditing: false })
}

async function save (transaction: any) {
  store.commit('setIsLoading', true)
  await store.dispatch('transactions/update', transaction)
}

function confirmDelete (transaction: any) {
  if (deleteConfirmationModal.value && transaction) {
    deleteConfirmationModal.value.open(deleteTransaction, transaction.id, null)
  }
}

async function deleteTransaction (id: number) {
  await store.dispatch('transactions/delete', id)
}

onBeforeRouteLeave(() => {
  transactions.value.filter(transaction => transaction.isEditing).forEach(transaction => {
    store.commit('transactions/setTransactionIsEditing', { ...transaction, isEditing: false })
  })
  editTransaction.value = null
})

watch(() => route.params, () => {
  accountUrl.value = route.params.url as string

  if (accountUrl.value) {
    store.dispatch('accounts/find', accountUrl.value)
  } else {
    store.commit('accounts/setAccount', undefined)
  }
})

watch(account.value, (newValue: any) => {
  if (newValue) {
    store.dispatch('transactions/getByAccount', newValue.id)
  } else {
    store.dispatch('transactions/get')
  }
})
</script>
