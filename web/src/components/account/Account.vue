<template>
  <div class="flex-column">
    <span class="flex-row transaction-header-row">
      <h2 class="text-light">{{ account ? account.name : "All Accounts" }}</h2>
      <h2 :class="{ 'text-success': this.total > 0, 'text-light': !this.total, 'text-danger': this.total < 0 }">{{ $filters.toCurrency(total) }}</h2>
      <div class="flex-row align-items-center">
        <button type="button"
                class="btn btn-light mb-1 ms-2"
                @click="showImportDialog()"
                title="Import Transactions"
                data-bs-toggle="tooltip"
                data-bs-placement="top">
          <i class="bi bi-file-earmark-arrow-up"></i>
        </button>
        <button type="button"
                class="btn btn-primary mb-1 ms-2"
                @click="showAddTransactionDialog()"
                title="Add Transaction"
                data-bs-toggle="tooltip"
                data-bs-placement="top">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
    </span>
    <TransactionList />
  </div>

  <TransactionDialog ref="transactionDialog" />
</template>

<script>
import { mapState } from 'vuex'
import TransactionDialog from './TransactionDialog.vue'
import TransactionList from './TransactionList.vue'

export default {
  name: 'Account',
  components: {
    TransactionDialog,
    TransactionList
  },
  computed: {
    ...mapState({
      account: state => state.accounts.account,
      transactions: state => state.transactions.all
    }),
    total () {
      return this.transactions.reduce((total, transaction) => total + transaction.cost, 0)
    }
  },
  data () {
    return {
      accountUrl: null
    }
  },
  methods: {
    showAddTransactionDialog () {
      if (this.$refs.transactionDialog) {
        this.$refs.transactionDialog.open(this.account?.id)
      }
    }
  },
  mounted () {
    this.$watch(
      () => this.$route.params,
      () => {
        this.accountUrl = this.$route.params.url
        this.name = null
        this.description = null

        if (this.accountUrl) {
          this.$store.dispatch('accounts/find', this.accountUrl)
        } else {
          this.$store.commit('accounts/setAccount', undefined)
        }
      },
      { immediate: true }
    )
  },
  watch: {
    account (value) {
      if (value) {
        this.$store.dispatch('transactions/getByAccount', value.id)
      } else {
        this.$store.dispatch('transactions/get')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .transaction-header-row {
    justify-content: space-between;
  }
</style>