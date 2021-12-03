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

  <DeleteConfirmation ref="deleteConfirmationModal" />
  <TransactionDialog ref="transactionDialog" />
</template>

<script>
import { mapState } from 'vuex'
import TransactionDialog from './TransactionDialog.vue'
import TransactionList from './TransactionList.vue'

export default {
  name: 'Account',
  beforeRouteLeave () {
    this.transactions.filter(transaction => transaction.isEditing).forEach(transaction => {
      this.$store.commit('transactions/setTransactionIsEditing', { ...transaction, isEditing: false })
    })
    this.editTransaction = null
  },
  components: {
    TransactionDialog,
    TransactionList
  },
  computed: {
    ...mapState({
      account: state => state.accounts.account,
      accounts: state => state.accounts.all,
      categoryGroups: state => state.categoryGroups.all,
      categories: state => state.categories.all,
      recipients: state => state.recipients.all,
      transactions: state => state.transactions.all
    }),
    total () {
      return this.transactions.reduce((total, transaction) => total + transaction.cost, 0)
    }
  },
  data () {
    return {
      editTransaction: null,
      renameText: '',
      accountUrl: null
    }
  },
  methods: {
    getCategoryName (id) {
      const category = this.categories.find(c => c.id === id)
      return category ? category.name : 'Ready to Budget'
    },

    getAccountName (id) {
      const account = this.accounts?.find(a => a.id === id)
      return account ? account.name : ''
    },

    getRecipientName (id) {
      const recipient = this.recipients?.find(r => r.id === id)
      return recipient ? recipient.name : ''
    },

    startEditing (transaction) {
      const unsavedTransaction = this.transactions.find(t => t.isEditing)
      if (unsavedTransaction) {
        this.cancelEditing(unsavedTransaction)
      }
      const dateString = this.$filters.toShortDate(new Date(transaction.date), 'yyyy-MM-dd')
      this.editTransaction = { ...transaction, date: dateString }
      this.$store.commit('transactions/setTransactionIsEditing', { ...transaction, isEditing: true })
    },

    cancelEditing (transaction) {
      this.$store.commit('transactions/setTransactionIsEditing', { ...transaction, isEditing: false })
    },

    async save (transaction) {
      this.$store.commit('setIsLoading', true)
      await this.$store.dispatch('transactions/update', transaction)
    },

    confirmDelete (transaction) {
      if (this.$refs.deleteConfirmationModal && transaction) {
        this.$refs.deleteConfirmationModal.open(this.delete, transaction.id, null)
      }
    },

    async delete (id) {
      await this.$store.dispatch('transactions/delete', id)
    },

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