<template>
  <div class="modal fade" id="exampleModal" ref="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Add Transaction</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row gy-3">
              <div class="col-sm-12">
                <label for="date" class="form-label">Date</label>
                <input v-model="date"
                  type="date"
                  id="date"
                  class="form-control"
                  :class="{ 'is-invalid': v$.date.$error }"
                  placeholder="yyyy/MM/dd"
                  @blur="v$.date.$touch"
                  required>
                <div class="input-errors" v-for="error of v$.date.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="account" class="form-label">Account</label>
                <select id="account"
                        v-model="accountId"
                        name="account"
                        class="form-control"
                        @blur="v$.accountId.$touch"
                        required>
                  <option v-for="account in accounts" 
                          :key="account.id"
                          :value="account.id">{{ account.name }}</option>
                </select>
                <div class="input-errors" v-for="error of v$.accountId.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="category" class="form-label">Category</label>
                <select id="category" 
                        v-model="categoryId"
                        name="category"
                        class="form-control"
                        @blur="v$.categoryId.$touch"
                        required>
                  <option v-for="category in categories" 
                          :key="category.id"
                          :value="category.id">{{ category.name }}</option>
                </select>
                <div class="input-errors" v-for="error of v$.categoryId.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="cost" class="form-label">Cost</label>
                <CurrencyInput v-model.number="cost"
                               name="cost"
                               @blur="v$.cost.$touch"
                               :options="{ currency: 'USD', precision: 2 }"
                               required/>
                <div class="input-errors" v-for="error of v$.cost.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="recipient" class="form-label">Recipient</label>
                <select id="recipient" 
                        v-model="recipientId"
                        name="recipient"
                        class="form-control"
                        @blur="v$.recipientId.$touch"
                        required>
                  <option v-for="recipient in recipients" 
                          :key="recipient.id"
                          :value="recipient.id">{{ recipient.name }}</option>
                </select>
                <div class="input-errors" v-for="error of v$.recipientId.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button"
            class="btn btn-primary"
            :disabled="!v$.$dirty || v$.$invalid"
            @click="save()">Save</button>
          <button type="button"
            class="btn btn-secondary"
            @click="close()">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { mapState } from 'vuex'

import CurrencyInput from '../shared/CurrencyInput.vue'

export default {
  name: 'TransactionDialog',
  components: {
    CurrencyInput
  },
  computed: {
    ...mapState({
      account: state => state.accounts.account,
      accounts: state => state.accounts.all,
      categories: state => state.categories.all,
      recipients: state => state.recipients.all
    })
  },
  data () {
    return {
      modal: undefined,
      date: null,
      accountId: null,
      categoryId: null,
      cost: 0.00,
      recipientId: null
    }
  },
  methods: {
    open (defaultAccountId) {
      this.modal.show()
      this.reset(defaultAccountId)
    },
    close () {
      this.modal.hide()
    },
    reset (accountId) {
      this.date = new Date()
      this.accountId = accountId
      this.categoryId = null
      this.cost = 0.00
      this.recipientId = null
      this.$nextTick(() => {
        this.v$.$reset()
      })
    },
    async save () {
      if (this.v$.invalid) {
        return
      }
      const transaction = {
        accountId: this.accountId,
        categoryId: this.categoryId,
        date: this.date,
        cost: this.cost,
        recipientId: this.recipientId
      }
      await this.$store.dispatch('transactions/create', transaction)
      this.close()
    },
    convertToMoney (event) {
      if (!event.target.value) { return }

      const cost = Math.round(event.target.value * 100) / 100
      this.cost = cost
    },
    blurCost (event) {
      this.v$.cost.$touch()
      this.convertToMoney(event)
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {})
    if (!this.categories?.length) {
      this.$store.dispatch('categories/get')
    }
    if (!this.recipients?.length) {
      this.$store.dispatch('recipients/get')
    }
  },
  setup () {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      date: { required },
      accountId: { required },
      categoryId: { required },
      cost: { required },
      recipientId: { required }
    }
  }
}
</script>

<style scoped lang="scss">
</style>