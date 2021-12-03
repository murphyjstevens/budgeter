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
            {{ $filters.toShortDate(new Date(transaction.date))}}
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

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script>
import { mapState } from 'vuex'
import { DeleteConfirmation } from '../shared'
import CurrencyInput from '../shared/CurrencyInput.vue'

export default {
  name: 'TransactionList',
  beforeRouteLeave () {
    this.transactions.filter(transaction => transaction.isEditing).forEach(transaction => {
      this.$store.commit('transactions/setTransactionIsEditing', { ...transaction, isEditing: false })
    })
    this.editTransaction = null
  },
  components: {
    CurrencyInput,
    DeleteConfirmation
  },
  computed: {
    ...mapState({
      account: state => state.accounts.account,
      accounts: state => state.accounts.all,
      categories: state => state.categories.all,
      recipients: state => state.recipients.all,
      transactions: state => state.transactions.all
    })
  },
  data () {
    return {
      editTransaction: null,
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
</style>