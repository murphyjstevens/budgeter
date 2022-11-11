<template>
  <div class="flex-column">
    <span class="flex-row transaction-header-row">
      <h2 class="text-light">{{ account ? account.name : 'All Accounts' }}</h2>
      <h2
        :class="{
          'text-success': total > 0,
          'text-light': !total,
          'text-danger': total < 0,
        }"
      >
        {{ toCurrency(total) }}
      </h2>
      <div class="flex-row align-items-center">
        <button
          type="button"
          class="btn btn-light mb-1 ms-2"
          @click="showImportDialog()"
          title="Import Transactions"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
        >
          <i class="bi bi-file-earmark-arrow-up"></i>
        </button>
        <button
          type="button"
          class="btn btn-primary mb-1 ms-2"
          @click="showAddTransactionDialog()"
          title="Add Transaction"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
        >
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
    </span>
    <TransactionList />
  </div>

  <TransactionDialog ref="transactionDialog" />
</template>

<script setup lang="ts">
import { type ComputedRef, computed, ref, type Ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import { toCurrency } from '@/helpers/helpers'
import TransactionDialog from './TransactionDialog.vue'
import TransactionList from './TransactionList.vue'
import type { Account, Transaction } from '@/models'

const route = useRoute()
const store = useStore()

const accountUrl: Ref<string | null> = ref(null)
const transactionDialog: Ref = ref()

const account: ComputedRef<Account> = computed(
  () => store.state.accounts.account
)
const transactions: ComputedRef<Array<Transaction>> = computed(
  () => store.state.transactions.all
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
      store.dispatch('accounts/find', accountUrl)
    } else {
      store.commit('accounts/setAccount', undefined)
    }
  },
  { immediate: true }
)

watch(account.value, (newValue: Account) => {
  if (newValue) {
    store.dispatch('transactions/getByAccount', newValue.id)
  } else {
    store.dispatch('transactions/get')
  }
})
</script>

<style scoped>
.transaction-header-row {
  justify-content: space-between;
}
</style>
