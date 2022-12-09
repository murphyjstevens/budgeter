<template>
  <table class="bg-slate-700">
    <colgroup>
      <col class="w-2/12 min-w-fit" />
      <col v-if="!account" class="w-2/12" />
      <col class="w-3/12" />
      <col class="w-2/12" />
      <col class="w-2/12 min-w-fit" />
      <col class="w-3/12" />
      <col class="w-28" />
    </colgroup>
    <thead class="bg-slate-800">
      <tr class="text-left">
        <th class="px-3 py-2">Date</th>
        <th v-if="!account" class="px-3 py-2">Account</th>
        <th class="px-3 py-2">Recipient</th>
        <th class="px-3 py-2">Category</th>
        <th class="text-right px-3 py-2">Cost</th>
        <th class="px-3 py-2">Tags</th>
        <th class="px-3 py-2"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="transaction in transactions"
        :key="transaction.id"
        class="h-12 hover:bg-slate-600"
      >
        <td class="px-3 py-2">
          <div v-if="transaction.isEditing && editTransaction">
            <BInput
              type="date"
              name="date"
              v-model="editTransaction.date"
              placeholder="yyyy/MM/dd"
              required
            ></BInput>
          </div>
          <div v-if="!transaction.isEditing">
            {{ toShortDate(new Date(transaction.date)) }}
          </div>
        </td>
        <td v-if="!account" class="px-3 py-2">
          <div v-if="transaction.isEditing && editTransaction">
            <BSelect
              v-model="editTransaction.accountId"
              id="account"
              name="account"
              required
            >
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
                {{ acc.name }}
              </option>
            </BSelect>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getAccountName(transaction.accountId) }}
          </div>
        </td>
        <td class="px-3 py-2">
          <div v-if="transaction.isEditing && editTransaction">
            <BSelect
              v-model="editTransaction.recipientId"
              id="recipient"
              name="recipient"
              required
            >
              <option v-for="rec in recipients" :key="rec.id" :value="rec.id">
                {{ rec.name }}
              </option>
            </BSelect>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getRecipientName(transaction.recipientId) }}
          </div>
        </td>
        <td class="px-3 py-2">
          <div v-if="transaction.isEditing && editTransaction">
            <BSelect
              v-model="editTransaction.categoryId"
              id="category"
              name="category"
              required
            >
              <option :value="null">Ready to Budget</option>

              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </BSelect>
          </div>
          <div v-if="!transaction.isEditing">
            {{ getCategoryName(transaction.categoryId) }}
          </div>
        </td>
        <td class="px-3 py-2">
          <div v-if="transaction.isEditing && editTransaction">
            <CurrencyInput
              v-model="editTransaction.cost"
              name="cost"
              :options="{ currency: 'USD', precision: 2 }"
              required
            />
          </div>
          <div v-if="!transaction.isEditing" class="text-right">
            {{ toCurrency(transaction.cost) }}
          </div>
        </td>
        <td class="px-3 py-2"></td>
        <td class="flex flex-row px-3 py-2">
          <BButton
            v-if="!transaction.isEditing"
            @click="startEditing(transaction)"
            type="primary-icon-only"
            icon="pencil-fill"
            class="px-2"
          ></BButton>

          <BButton
            v-if="!transaction.isEditing"
            @click="confirmDelete(transaction)"
            type="danger-icon-only"
            icon="trash-fill"
            class="px-2"
          ></BButton>

          <BButton
            v-if="transaction.isEditing"
            @click="save(editTransaction)"
            type="primary-icon-only"
            icon="check-circle-fill"
            class="px-2"
          ></BButton>

          <BButton
            v-if="transaction.isEditing"
            @click="cancelEditing(transaction)"
            type="default-icon-only"
            icon="x-circle-fill"
            class="px-2"
          ></BButton>
        </td>
      </tr>
    </tbody>
  </table>

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script setup lang="ts">
import { type ComputedRef, computed, ref, type Ref } from 'vue'
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
import { BButton, BInput, BSelect } from '../shared'

const accountStore = useAccountStore()
const categoryStore = useCategoryStore()
const loadingStore = useLoadingStore()
const recipientStore = useRecipientStore()
const transactionStore = useTransactionStore()

const deleteConfirmationModal = ref()

const editTransaction: Ref<Transaction | null> = ref(null)

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
  if (!id) return 'Ready to Budget'

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
</script>
