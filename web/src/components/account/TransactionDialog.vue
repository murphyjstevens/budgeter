<template>
  <div class="modal fade" id="exampleModal" ref="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Add Project</h5>
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
                        required>
                  <option v-for="account in accounts" 
                          :key="account.id"
                          :value="account.id">{{ account.name }}</option>
                </select>
                <div class="input-errors" v-for="error of v$.account.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="category" class="form-label">Category</label>
                <select id="category" 
                        v-model="categoryId"
                        name="category" 
                        class="form-control" 
                        required>
                  <option v-for="category in categories" 
                          :key="category.id"
                          :value="category.id">{{ category.name }}</option>
                </select>
                <div class="input-errors" v-for="error of v$.category.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="cost" class="form-label">Cost</label>
                <input id="cost"
                       v-model.number="cost"
                       @blur="convertToMoney($event)"
                       @keyup.enter="convertToMoney($event)"
                       name="cost"
                       maxLength="15"
                       class="form-control text-right"
                       required>
                <div class="input-errors" v-for="error of v$.cost.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="recipient" class="form-label">Recipient</label>
                <input id="recipient"
                       v-model="recipient"
                       type="text"
                       name="recipient"
                       class="form-control"
                       required>
                <div class="input-errors" v-for="error of v$.recipient.$errors" :key="error.$uid">
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

export default {
  name: 'TransactionDialog',
  computed: {
    ...mapState({
      account: state => state.accounts.account,
      accounts: state => state.accounts.all,
      categories: state => state.categories.all
    })
  },
  data () {
    return {
      modal: undefined,
      date: null,
      accountId: null,
      categoryId: null,
      cost: 0.00,
      recipient: ''
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
      this.recipient = ''
      this.$nextTick(() => {
        this.v$.$reset()
      })
    },
    async save () {
      if (this.v$.invalid) {
        return
      }
      await this.$store.dispatch('transactions/create', { name: this.name, description: this.description })
      this.close()
    },
    convertToMoney (event) {
      if (!event.target.value) { return }

      const cost = Math.round(event.target.value * 100) / 100
      this.cost = cost
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {})
  },
  setup () {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      date: { required },
      account: { required },
      category: { required },
      cost: { required },
      recipient: { required }
    }
  }
}
</script>

<style scoped lang="scss">
</style>