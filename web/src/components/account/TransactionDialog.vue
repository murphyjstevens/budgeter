<template>
  <div class="modal fade" id="exampleModal" ref="modalRef" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                <input v-model="v$.date.$model"
                       type="date"
                       id="date"
                       class="form-control"
                       :class="{ 'is-invalid': v$.date.$error }"
                       placeholder="yyyy/MM/dd"
                       required>
                <div class="input-errors" v-for="error of v$.date.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="account" class="form-label">Account</label>
                <select id="account"
                        v-model="v$.accountId.$model"
                        name="account"
                        class="form-select"
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
                        v-model="v$.categoryId.$model"
                        name="category"
                        class="form-select"
                        required>
                  <option :value="null">Ready to Budget</option>
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
                <div class="input-group">
                  <div class="input-group-text form-switch">
                    <input class="form-check-input mt-0 ms-0" type="checkbox" v-model="isPositive" aria-label="Checkbox for following text input">
                    <h3 class="cost-sign ms-1"
                        :class="{ 'text-success': isPositive, 'text-danger': !isPositive }">{{ isPositive ? '+' : '-' }}</h3>
                  </div>
                  <CurrencyInput v-model.number="v$.cost.$model"
                                 v-select-all
                                 name="cost"
                                 :options="{ currency: 'USD', precision: 2 }"
                                 required/>
                </div>
                <div class="input-errors" v-for="error of v$.cost.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <label for="recipient" class="form-label">Recipient</label>
                <select id="recipient" 
                        v-model="v$.recipientId.$model"
                        name="recipient"
                        class="form-select"
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
            class="btn btn-secondary"
            @click="close()">Close</button>
          <button type="button"
            class="btn btn-primary"
            :disabled="!v$.$dirty || v$.$invalid"
            @click="save()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Modal } from 'bootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useStore } from 'vuex'

import { toShortDate } from '@/helpers/helpers';

import CurrencyInput from '../shared/CurrencyInput.vue'
import { type Ref, ref, computed, type ComputedRef, reactive, onMounted, nextTick } from 'vue'

const store = useStore()

const state = reactive({
  date: null as string | null,
  accountId: null as number | null,
  categoryId: null as number | null,
  cost: 0.00 as number,
  recipientId: null as number | null
})

const rules = {
  date: { required, $autoDirty: true },
  accountId: { required, $autoDirty: true },
  categoryId: { $autoDirty: true },
  cost: { required, $autoDirty: true },
  recipientId: { required, $autoDirty: true }
}

const v$ = useVuelidate(rules, state)

const modalRef = ref()
const modal: Ref = ref(null)
const isPositive: Ref<boolean> = ref(false);

const account: ComputedRef<any> = computed(() => store.state.accounts.account)
const accounts: ComputedRef<Array<any>> = computed(() => store.state.accounts.all)
const categories: ComputedRef<Array<any>> = computed(() => store.state.categories.all)
const recipients: ComputedRef<Array<any>> = computed(() => store.state.recipients.all)

function open (defaultAccountId: number) {
  modal.value.show()
  reset(defaultAccountId)
}

function close () {
  modal.value.hide()
}

function reset (newAccountId: number) {
  state.date = toShortDate(new Date(), 'yyyy-MM-dd')
  state.accountId = newAccountId
  state.categoryId = null
  state.cost = 0.00
  state.recipientId = null
  nextTick(() => {
    v$.value.$reset()
    if (state.date) v$.value.date.$touch()
    if (state.accountId) v$.value.accountId.$touch()
    v$.value.categoryId.$touch()
  })
}

async function save () {
  if (v$.value.invalid) {
    return
  }
  const signedCost = isPositive.value ? state.cost : state.cost * -1
  const transaction = {
    accountId: state.accountId,
    categoryId: state.categoryId,
    date: state.date,
    cost: signedCost,
    recipientId: state.recipientId
  }
  await store.dispatch('transactions/create', transaction)
  close()
}

onMounted(() => {
  modal.value = new Modal(modalRef.value, {})
  if (!categories.value?.length) {
    store.dispatch('categories/get')
  }
  if (!recipients.value?.length) {
    store.dispatch('recipients/get')
  }
})
</script>

<style scoped>
  .cost-sign {
    line-height: 0.25;
    width: 16px;
  }
</style>