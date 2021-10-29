<template>
  <div class="flex-column">
    <span class="flex-row transaction-header-row">
      <h2>{{ account ? account.name : "All Accounts" }}</h2>
      <button type="button"
              class="btn btn-primary button-icon add-transaction-button"
              @click="showAddTransactionDialog()">
        <i class="bi bi-plus-lg icon-button"></i>
      </button>
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
              {{ $filters.toShortDate(transaction.date)}}
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
              <input id="recipient"
                    type="text"
                    v-model="editTransaction.recipient"
                    name="recipient"
                    class="form-control"
                    required>
            </div>
            <div v-if="!transaction.isEditing">
              {{ transaction.recipient }}
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
              <input id="cost"
                     v-model="editTransaction.cost"
                     @blur="convertToMoney($event, editTransaction)"
                     @keyup.enter="convertToMoney($event, editTransaction)"
                     name="cost"
                     class="form-control text-align-right"
                     required>
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
                      class="cell-button-icon cell-button-icon-primary" 
                      @click="startEditing(transaction)">
                <i class="bi-pencil text-primary"></i>
              </button>
              <button v-if="!transaction.isEditing" 
                      type="button" 
                      class="cell-button-icon cell-button-icon-danger"
                      @click="confirmDelete(transaction)">
                <i class="bi-trash text-danger"></i>
              </button>
              <button v-if="transaction.isEditing" 
                      type="button" 
                      class="cell-button-icon cell-button-icon-success" 
                      @click="save(editTransaction)">
                <i class="bi-check-circle text-success"></i>
              </button>
              <button v-if="transaction.isEditing" 
                      type="button" 
                      class="cell-button-icon cell-button-icon-secondary" 
                      @click="cancelEditing(transaction)">
                <i class="bi-x-circle text-secondary"></i>
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

export default {
  name: 'Account',
  components: {
    DeleteConfirmation,
    TransactionDialog
  },
  computed: {
    ...mapState({
      account: state => state.accounts.account,
      accounts: state => state.accounts.all,
      categoryGroups: state => state.categoryGroups.all,
      categories: state => state.categories.all,
      transactions: state => state.transactions.all
    })
  },
  data () {
    return {
      isEditingRow: false,
      editTransaction: null,
      renameText: '',
      accountUrl: null
    }
  },
  methods: {
    getCategoryName (id) {
      const category = this.categories.find(c => c.id === id)
      return category ? category.name : ''
    },

    getAccountName (id) {
      const account = this.accounts?.find(a => a.id === id)
      return account ? account.name : ''
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
      this.editTransaction = { ...transaction }
      transaction.isEditing = true
    },

    cancelEditing (transaction) {
      transaction.isEditing = false
    },

    async save (transaction) {
      this.$store.commit('setIsLoading', true)
      const updatedTransaction = await this.$store.dispatch('transactions/update', transaction)

      const transactionIndex = this.transactions.findIndex(t => t.id === updatedTransaction.id)
      this.transactions[transactionIndex] = updatedTransaction
      this.sortTransactions()
      transaction.isEditing = false
      this.isEditingRow = false
    },

    confirmDelete (transaction) {
      if (this.$refs.deleteConfirmationModal && transaction) {
        this.$refs.deleteConfirmationModal.open(this.delete, transaction.id, null)
      }
    },

    async delete (transaction) {
      await this.$store.dispatch('transactions/delete', transaction.id)
      this.transactions.splice(this.transactions.findIndex(t => t.id === transaction.id), 1)
    },
    
    sortTransactions () {
      this.transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
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

  .add-transaction-button {
    align-self: center;
    margin: 0.5em 0;
  }
</style>