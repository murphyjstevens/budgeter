<template>
  <div class="flex flex-col">
    <span class="flex flex-row transaction-header-row">
      <h2 class="text-2xl">{{ account ? account.name : 'All Accounts' }}</h2>
      <h2
        class="text-2xl"
        :class="{
          'text-green-500': total > 0,
          'text-white': !total,
          'text-red-500': total < 0,
        }"
      >
        {{ toCurrency(total) }}
      </h2>
      <div class="flex flex-row items-center">
        <BButton
          @click="showImportDialog()"
          type="default-outline"
          icon="file-earmark-arrow-up"
          class="mb-1 ml-2"
          title="Import Transactions"
        ></BButton>

        <BButton
          @click="showAddTransactionDialog()"
          type="primary-outline"
          icon="plus-lg"
          text="Transaction"
          class="mb-1 ml-2"
          title="Add Transaction"
        ></BButton>
      </div>
    </span>
    <TransactionList />
  </div>

  <!-- <TransactionDialog ref="transactionDialog" /> -->
</template>

<script setup lang="ts">
import { type ComputedRef, computed, ref, type Ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { toCurrency } from '@/helpers/helpers'
import TransactionDialog from '../components/account/TransactionDialog.vue'
import TransactionList from '../components/account/TransactionList.vue'
import type { Account, Transaction } from '@/models'
import { useAccountStore, useTransactionStore } from '@/store'
import BButton from '@/components/shared/BButton.vue'

const accountStore = useAccountStore()
const transactionStore = useTransactionStore()

const route = useRoute()

const accountUrl: Ref<string | null> = ref(null)
const transactionDialog: Ref = ref()

const account: ComputedRef<Account | null> = computed(
  () => accountStore.account
)
const transactions: ComputedRef<Array<Transaction>> = computed(
  () => transactionStore.all
)

const total: ComputedRef<number> = computed(() =>
  transactions.value.reduce(
    (total: number, transaction: Transaction) => total + transaction.cost,
    0
  )
)

function showAddTransactionDialog(): void {
  if (transactionDialog.value) {
    transactionDialog.value.open(account.value?.id)
  }
}

function showImportDialog() {}

watch(
  () => route.params.id,
  () => {
    accountUrl.value = route.params.url as string

    if (accountUrl.value) {
      accountStore.find(accountUrl.value)
    } else {
      accountStore.account = null
    }
  },
  { immediate: true }
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

<style scoped>
.transaction-header-row {
  justify-content: space-between;
}
</style>
