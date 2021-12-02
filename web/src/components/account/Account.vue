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
              {{ $filters.toShortDate(new Date(transaction.date))}}
            </div>
          </td>
          <td v-if="!account">
            <div v-if="transaction.isEditing">
              <select id="account"
                      v-model="editTransaction.accountId"
                      name="account"
                      class="form-control"
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
                      class="form-control"
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
                      class="form-control"
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
                             name="cost"
                             :options="{ currency: 'USD', precision: 2 }"
                             required/>
            </div>
            <div v-if="!transaction.isEditing" class="text-align-right">
              {{ $filters.toCurrency(transaction.cost) }}
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
  </div>

  <DeleteConfirmation ref="deleteConfirmationModal" />
  <TransactionDialog ref="transactionDialog" />
</template>

<script>
import { mapState } from 'vuex'
import DeleteConfirmation from '../shared/DeleteConfirmation.vue'
import TransactionDialog from './TransactionDialog.vue'
import CurrencyInput from '../shared/CurrencyInput.vue'

export default {
  name: 'Account',
  beforeRouteLeave () {
    this.transactions.filter(transaction => transaction.isEditing).forEach(transaction => {
      this.$store.commit('transactions/setTransactionIsEditing', { ...transaction, isEditing: false })
    })
    this.editTransaction = null
  },
  components: {
    CurrencyInput,
    DeleteConfirmation,
    TransactionDialog
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

    convertToMoney (event, transaction) {
      if (!event.target.value) { return }

      transaction.cost = Math.round(event.target.value * 100) / 100

      event.target.value = transaction.cost
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

  .account-header-button {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    margin-left: 0.5em;
  }
</style>