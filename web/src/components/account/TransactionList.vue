<template>
  <table class="table table-dark">
    <colgroup>
      <col style="width: 15%; min-width: 175px" />
      <col v-if="!account" style="width: 20%" />
      <col style="width: 25%" />
      <col style="width: 20%" />
      <col style="width: 15%; min-width: 110px" />
      <col style="width: 25%" />
      <col style="width: 50px" />
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
      <tr v-for="transaction in transactions" :key="transaction.id">
        <td>
          <div v-if="transaction.isEditing && editTransaction">
            <input
              class="form-control"
              type="date"
              name="date"
              v-model="editTransaction.date"
              placeholder="yyyy/MM/dd"
              required
            />
          </div>
          <div v-if="!transaction.isEditing">
            {{ toShortDate(new Date(transaction.date)) }}
          </div>
        </td>
        <td v-if="!account">
          <div v-if="transaction.isEditing && editTransaction">
            <select
              id="account"
              v-model="editTransaction.accountId"
              name="account"
              class="form-select"
              required
            >
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
                {{ acc.name }}
              </option>
            </select>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getAccountName(transaction.accountId) }}
          </div>
        </td>
        <td>
          <div v-if="transaction.isEditing && editTransaction">
            <select
              id="recipient"
              v-model="editTransaction.recipientId"
              name="recipient"
              class="form-select"
              required
            >
              <option v-for="rec in recipients" :key="rec.id" :value="rec.id">
                {{ rec.name }}
              </option>
            </select>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getRecipientName(transaction.recipientId) }}
          </div>
        </td>
        <td>
          <div v-if="transaction.isEditing && editTransaction">
            <select
              id="category"
              v-model="editTransaction.categoryId"
              name="category"
              class="form-select"
              required
            >
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getCategoryName(transaction.categoryId) }}
          </div>
        </td>
        <td>
          <div v-if="transaction.isEditing && editTransaction">
            <CurrencyInput
              v-model="editTransaction.cost"
              v-select-all
              name="cost"
              :options="{ currency: 'USD', precision: 2 }"
              class="text-end"
              required
            />
          </div>
          <div v-if="!transaction.isEditing" class="text-end">
            {{ toCurrency(transaction.cost) }}
          </div>
        </td>
        <td></td>
        <td class="icons-cell">
          <div class="icons-container">
            <button
              v-if="!transaction.isEditing"
              type="button"
              class="btn link-primary"
              @click="startEditing(transaction)"
            >
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button
              v-if="!transaction.isEditing"
              type="button"
              class="btn link-danger"
              @click="confirmDelete(transaction)"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
            <button
              v-if="transaction.isEditing"
              type="button"
              class="btn link-success"
              @click="save(editTransaction)"
            >
              <i class="bi bi-check-circle-fill"></i>
            </button>
            <button
              v-if="transaction.isEditing"
              type="button"
              class="btn link-secondary"
              @click="cancelEditing(transaction)"
            >
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
import { onBeforeRouteLeave, useRoute } from 'vue-router'

import { toCurrency, toShortDate } from '@/helpers/helpers'
import { CurrencyInput, DeleteConfirmation } from '@/components/shared'
import type { Account, Category, Recipient, Transaction } from '@/models'
import {
  useAccountStore,
  useCategoryStore,
  useLoadingStore,
  useRecipientStore,
  useTransactionStore,
} from '@/store'

const route = useRoute()
const accountStore = useAccountStore()
const categoryStore = useCategoryStore()
const loadingStore = useLoadingStore()
const recipientStore = useRecipientStore()
const transactionStore = useTransactionStore()

const deleteConfirmationModal = ref()

const editTransaction: Ref<Transaction | null> = ref(null)
const accountUrl: Ref<string | null> = ref(null)

const account: ComputedRef<Account | null> = computed(
  () => accountStore.account
)
const accounts: ComputedRef<Array<Account>> = computed(() => accountStore.all)
const categories: ComputedRef<Array<Category>> = computed(
  () => categoryStore.all
)
const recipients: ComputedRef<Array<Recipient>> = computed(
  () => recipientStore.all
)
const transactions: ComputedRef<Array<Transaction>> = computed(
  () => transactionStore.all
)

function getCategoryName(id: number | null): string {
  if (!id) return ''

  const category = categories.value.find((c) => c.id === id)
  return category ? category.name : 'Ready to Budget'
}

function getAccountName(id: number): string {
  const account = accounts.value?.find((a) => a.id === id)
  return account ? account.name : ''
}

function getRecipientName(id: number): string {
  const recipient = recipients.value?.find((r) => r.id === id)
  return recipient ? recipient.name : ''
}

function startEditing(transaction: Transaction | null) {
  if (!transaction) return

  const unsavedTransaction = transactions.value.find((t) => t.isEditing)
  if (unsavedTransaction) {
    cancelEditing(unsavedTransaction)
  }
  const dateString = toShortDate(new Date(transaction.date), 'yyyy-MM-dd')
  editTransaction.value = { ...transaction, date: dateString }
  transactionStore.setTransactionIsEditing({
    ...transaction,
    isEditing: true,
  })
}

function cancelEditing(transaction: Transaction | null) {
  if (transaction) {
    transactionStore.setTransactionIsEditing({
      ...transaction,
      isEditing: false,
    })
  }
}

async function save(transaction: Transaction | null) {
  if (transaction) {
    loadingStore.setIsLoading(true)
    await transactionStore.update(transaction)
  }
}

function confirmDelete(transaction: Transaction) {
  if (deleteConfirmationModal.value && transaction) {
    deleteConfirmationModal.value.open(deleteTransaction, transaction.id, null)
  }
}

async function deleteTransaction(id: number) {
  await transactionStore.remove(id)
}

onBeforeRouteLeave(() => {
  transactions.value
    .filter((transaction) => transaction.isEditing)
    .forEach((transaction) => {
      transactionStore.setTransactionIsEditing({
        ...transaction,
        isEditing: false,
      })
    })
  editTransaction.value = null
})

watch(
  () => route.params,
  () => {
    accountUrl.value = route.params.url as string

    if (accountUrl.value) {
      accountStore.find(accountUrl.value)
    } else {
      accountStore.account = null
    }
  }
)

watch(
  () => account.value,
  (newValue: Account | null) => {
    if (newValue) {
      transactionStore.getByAccount(newValue.id)
    } else {
      transactionStore.get()
    }
  }
)
</script>
